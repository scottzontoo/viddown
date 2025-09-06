import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";
import { getYouTubeInfo, selectBestMp4, selectBestAudio } from "@/lib/youtube";
import { getXInfo } from "@/lib/x";
import { getTikTokInfo } from "@/lib/tiktok";

type Source = { quality?: string; type?: string; url: string };
type Resolved = { title?: string; thumbnails?: string[]; sources: Source[]; provider: string };

function detectProvider(u: string): "tiktok" | "youtube" | "x" | "unknown" {
  try {
    const host = new URL(u).host.replace(/^www\./, "");
    if (host.includes("tiktok.com")) return "tiktok";
    if (host.includes("youtube.com") || host.includes("youtu.be")) return "youtube";
    if (host === "x.com" || host.includes("twitter.com")) return "x";
    return "unknown";
  } catch {
    return "unknown";
  }
}

// Provider adapters using real extraction helpers.
const adapters = {
  tiktok: async (url: string): Promise<Resolved> => {
    const info = await getTikTokInfo(url);
    const sources = info.sources.map((s) => ({
      quality: s.quality ?? (s.type?.includes("m3u8") ? "HLS" : "MP4"),
      type: s.type ?? (s.url.endsWith(".m3u8") ? "application/vnd.apple.mpegurl" : "video/mp4"),
      url: `/api/tiktok/download?url=${encodeURIComponent(s.url)}&title=${encodeURIComponent(info.title ?? "tiktok")}`,
    }));
  return {
      title: info.title,
      provider: "TikTok",
      thumbnails: [],
      sources,
    };
  },
  youtube: async (url: string): Promise<Resolved> => {
    const info = await getYouTubeInfo(url);
    const best1080 = selectBestMp4(info.formats, 1080);
    const best720 = selectBestMp4(info.formats, 720);
    const audio = selectBestAudio(info.formats);
    const sources = [] as Source[];
    if (audio) sources.push({ quality: "Audio", type: audio.mimeType, url: `/api/youtube/download?url=${encodeURIComponent(url)}&itag=${audio.itag}&title=${encodeURIComponent(info.title)}` });
    if (best1080) sources.push({ quality: best1080.qualityLabel ?? "1080p", type: best1080.mimeType, url: `/api/youtube/download?url=${encodeURIComponent(url)}&itag=${best1080.itag}&title=${encodeURIComponent(info.title)}` });
    if (best720 && best720.itag !== best1080?.itag) sources.push({ quality: best720.qualityLabel ?? "720p", type: best720.mimeType, url: `/api/youtube/download?url=${encodeURIComponent(url)}&itag=${best720.itag}&title=${encodeURIComponent(info.title)}` });
    return {
      title: info.title,
      provider: "YouTube",
      thumbnails: info.thumbnails,
      sources,
    };
  },
  x: async (url: string): Promise<Resolved> => {
    const info = await getXInfo(url);
  const sources = info.sources.map((s) => ({
      quality: s.quality ?? "MP4",
      type: s.type ?? "video/mp4",
      url: `/api/x/download?url=${encodeURIComponent(s.url)}&title=${encodeURIComponent(info.title ?? "x-video")}`,
    }));
  if (!sources.length) return { title: info.title, provider: "X", thumbnails: [], sources: [] };
    return {
      title: info.title,
      provider: "X",
      thumbnails: [],
      sources,
    };
  },
};

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl.searchParams.get("url");
    if (!url) return NextResponse.json({ error: "Missing url" }, { status: 400 });
    const provider = detectProvider(url);
    if (provider === "unknown") return NextResponse.json({ error: "Unsupported URL" }, { status: 400 });
    const data = await adapters[provider](url);
  if ((provider === "x" || provider === "tiktok") && (!data.sources || data.sources.length === 0)) {
      return NextResponse.json({ error: `No downloadable sources found for this ${provider.toUpperCase()} link. The post may be private, region-restricted, or has no video.` }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch (err: any) {
    const msg = typeof err?.message === "string" ? err.message : "Failed to resolve";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

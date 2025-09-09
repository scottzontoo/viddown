import { NextRequest, NextResponse } from "next/server";
import { detectProvider } from "../v1/utils";
import { getYouTubeInfo, selectBestMp4, selectBestAudio } from "@/lib/youtube";
import { getXInfo } from "@/lib/x";
import { getTikTokInfo } from "@/lib/tiktok";
import ytdl from "@distube/ytdl-core";
import { Readable } from "stream";

export const runtime = "nodejs";

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9-_\. ]/g, "_").slice(0, 150);
}

/**
 * Unified download endpoint that handles all supported platforms
 * @route GET /api/download
 */
export async function GET(req: NextRequest) {
  try {
    // Get the URL from the query parameter
    const url = req.nextUrl.searchParams.get("url");
    if (!url) {
      return NextResponse.json(
        { error: "Missing url parameter" },
        { status: 400 }
      );
    }

    // Detect which provider this URL belongs to
    const provider = detectProvider(url);
    if (provider === "unknown") {
      return NextResponse.json(
        { error: "Unsupported URL. We currently support TikTok, YouTube, and X (Twitter)" },
        { status: 400 }
      );
    }

    // Get video information based on provider
    switch (provider) {
      case "youtube":
        return await handleYouTubeDownload(url);
      case "tiktok":
        return await handleTikTokDownload(url);
      case "x":
        return await handleXDownload(url);
      default:
        return NextResponse.json(
          { error: "Unsupported provider" },
          { status: 400 }
        );
    }
  } catch (err: any) {
    const msg = typeof err?.message === "string" ? err.message : "Failed to download";
    if (msg.includes("Sign in") || msg.includes("bot")) {
      return NextResponse.json(
        { error: "Service temporarily unavailable. Please try again later." },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/**
 * Handle YouTube video downloads
 */
async function handleYouTubeDownload(url: string) {
  if (!ytdl.validateURL(url)) {
    return NextResponse.json(
      { error: "Invalid YouTube URL" },
      { status: 400 }
    );
  }

  const info = await getYouTubeInfo(url);

  // Always select the best available quality
  let format = selectBestMp4(info.formats, 1080) ||
               selectBestMp4(info.formats, 720) ||
               info.formats.find(f => f.hasVideo);

  if (!format) {
    // If no video format is available, try to get audio
    format = selectBestAudio(info.formats);

    if (!format) {
      return NextResponse.json(
        { error: "No downloadable formats available for this video" },
        { status: 404 }
      );
    }
  }

  // Determine file extension
  const baseMime = format.mimeType?.split(";")[0] || "";
  const ext = baseMime.includes("audio/")
    ? (baseMime.includes("webm") ? "webm" : baseMime.includes("mp4") ? "m4a" : "audio")
    : (baseMime.includes("webm") ? "webm" : "mp4");

  const filename = sanitizeFilename(`${info.title}.${ext}`);

  try {
    const nodeStream = ytdl(url, { quality: format.itag });
    const webStream = Readable.toWeb(nodeStream) as unknown as ReadableStream;

    return new Response(webStream, {
      headers: {
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Type": baseMime || "application/octet-stream",
      },
    });
  } catch (error: any) {
    // Try fallback to external API
    try {
      const fallbackUrl = `https://api.massdatagh.com/api/download?url=${encodeURIComponent(url)}`;
      const fallbackResponse = await fetch(fallbackUrl);

      if (fallbackResponse.ok) {
        return new Response(fallbackResponse.body, {
          headers: {
            "Content-Disposition": `attachment; filename="${filename}"`,
            "Content-Type": fallbackResponse.headers.get("Content-Type") || "application/octet-stream",
          },
        });
      }
    } catch (fallbackError) {
      // Fallback failed, continue with original error
    }

    return NextResponse.json(
      { error: error.message || "Failed to download YouTube video" },
      { status: 500 }
    );
  }
}

/**
 * Handle TikTok video downloads
 */
async function handleTikTokDownload(url: string) {
  const info = await getTikTokInfo(url);

  if (!info.sources || info.sources.length === 0) {
    return NextResponse.json(
      { error: "No downloadable sources found for this TikTok link. The post may be private or region-restricted." },
      { status: 404 }
    );
  }

  // Find the best quality source - prioritize MP4 over HLS when available
  let bestSource = info.sources.find(s => s.type?.includes("mp4") || s.url.endsWith(".mp4"));
  if (!bestSource) {
    bestSource = info.sources[0]; // Take the first if no MP4 available
  }

  const sourceUrl = bestSource.url;
  const title = info.title || "tiktok-video";
  const filename = sanitizeFilename(`${title}.mp4`);

  try {
    const response = await fetch(sourceUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch TikTok video: ${response.status}`);
    }

    return new Response(response.body, {
      headers: {
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Type": "video/mp4",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to download TikTok video" },
      { status: 500 }
    );
  }
}

/**
 * Handle X (Twitter) video downloads
 */
async function handleXDownload(url: string) {
  const info = await getXInfo(url);

  if (!info.sources || info.sources.length === 0) {
    return NextResponse.json(
      { error: "No downloadable sources found for this X (Twitter) link. The post may be private or has no video." },
      { status: 404 }
    );
  }

  // Find the highest quality video - X typically provides sources in ascending quality order
  // The last item is usually the highest quality
  const bestSource = info.sources[info.sources.length - 1];
  const sourceUrl = bestSource.url;
  const title = info.title || "x-video";
  const filename = sanitizeFilename(`${title}.mp4`);

  try {
    const response = await fetch(sourceUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch X video: ${response.status}`);
    }

    return new Response(response.body, {
      headers: {
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Type": "video/mp4",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to download X video" },
      { status: 500 }
    );
  }
}

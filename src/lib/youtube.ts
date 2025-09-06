import ytdl, { type videoInfo, type videoFormat } from "@distube/ytdl-core";

export type YouTubeFormat = {
  itag: number;
  mimeType?: string;
  qualityLabel?: string;
  contentLength?: string;
  url?: string;
  hasAudio?: boolean;
  hasVideo?: boolean;
};

export type YouTubeInfo = {
  title: string;
  thumbnails: string[];
  formats: YouTubeFormat[];
};

export async function getYouTubeInfo(videoUrl: string): Promise<YouTubeInfo> {
  if (!ytdl.validateURL(videoUrl)) {
    throw new Error("Invalid YouTube URL");
  }
  // Prefer English metadata
  try {
    const u = new URL(videoUrl);
    u.searchParams.set("hl", "en");
    videoUrl = u.toString();
  } catch {}
  const info: videoInfo = await (ytdl as any).getInfo(videoUrl, {
    requestOptions: {
      headers: {
        "Accept-Language": "en-US,en;q=0.9",
      },
    },
  });
  const title = info.videoDetails.title;
  const thumbnails = info.videoDetails.thumbnails?.map((t: { url: string }) => t.url) ?? [];
  const formats: YouTubeFormat[] = info.formats.map((f: videoFormat) => ({
    itag: f.itag,
    mimeType: f.mimeType ?? undefined,
    qualityLabel: f.qualityLabel ?? undefined,
    contentLength: f.contentLength,
    url: f.url,
    hasAudio: !!f.hasAudio,
    hasVideo: !!f.hasVideo,
  }));
  return { title, thumbnails, formats };
}

export function selectBestMp4(formats: YouTubeFormat[], maxHeight?: number) {
  const mp4 = formats
    .filter((f) => (f.mimeType?.includes("video/mp4") && f.hasVideo && f.hasAudio))
    .sort((a, b) => (height(b.qualityLabel) - height(a.qualityLabel)));
  if (maxHeight) {
    const cand = mp4.find((f) => height(f.qualityLabel) <= maxHeight);
    if (cand) return cand;
  }
  return mp4[0];
}

export function selectBestAudio(formats: YouTubeFormat[]) {
  const audio = formats
    .filter((f) => f.hasAudio && !f.hasVideo)
    .sort((a, b) => bitrate(b.mimeType) - bitrate(a.mimeType));
  return audio[0];
}

function height(label?: string) {
  const m = label?.match(/(\d{3,4})p/);
  return m ? parseInt(m[1], 10) : 0;
}

function bitrate(mime?: string) {
  // ytdl-core doesn't expose bitrate easily; as a proxy prefer mime with higher heuristic
  if (!mime) return 0;
  if (mime.includes("opus")) return 3;
  if (mime.includes("mp4a")) return 2;
  return 1;
}

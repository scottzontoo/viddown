import { NextRequest } from "next/server";
import ytdl from "@distube/ytdl-core";
import { Readable } from "stream";

export const runtime = "nodejs";

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9-_\. ]/g, "_").slice(0, 150);
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  const itagStr = req.nextUrl.searchParams.get("itag");
  const titleParam = req.nextUrl.searchParams.get("title") ?? "video";

  if (!url || !itagStr) {
    return new Response(JSON.stringify({ error: "Missing url or itag" }), { status: 400, headers: { "content-type": "application/json" } });
  }
  const itag = Number(itagStr);
  if (!Number.isFinite(itag)) {
    return new Response(JSON.stringify({ error: "Invalid itag" }), { status: 400, headers: { "content-type": "application/json" } });
  }
  if (!ytdl.validateURL(url)) {
    return new Response(JSON.stringify({ error: "Invalid YouTube URL" }), { status: 400, headers: { "content-type": "application/json" } });
  }

  try {
    const info = await ytdl.getInfo(url);
    const format = info.formats.find((f) => f.itag === itag);
    if (!format) {
      return new Response(JSON.stringify({ error: "Format not found" }), { status: 404, headers: { "content-type": "application/json" } });
    }
    const baseMime = format.mimeType?.split(";")[0] || "";
    const ext = baseMime.includes("audio/")
      ? (baseMime.includes("webm") ? "webm" : baseMime.includes("mp4") ? "m4a" : "audio")
      : (baseMime.includes("webm") ? "webm" : "mp4");
    const filename = sanitizeFilename(`${titleParam}.${ext}`);

    const nodeStream = ytdl(url, { quality: itag });
    const webStream = Readable.toWeb(nodeStream) as unknown as ReadableStream;

    const headers: Record<string, string> = {
      "content-type": baseMime || "application/octet-stream",
      "content-disposition": `attachment; filename="${filename}"`,
    };
    if (format.contentLength) headers["content-length"] = format.contentLength;

    return new Response(webStream, { headers });
  } catch (err: any) {
    const errorMessage = err?.message || "Download failed";
    if (errorMessage.includes("Sign in") || errorMessage.includes("bot")) {
      return new Response(JSON.stringify({ error: "We are currently sorry, YouTube downloader is currently under maintenance, Try again later, TikTok and X Download are Good" }), { status: 503, headers: { "content-type": "application/json" } });
    }
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500, headers: { "content-type": "application/json" } });
  }
}

import { NextRequest } from "next/server";

export const runtime = "nodejs";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import { PassThrough, Readable } from "stream";

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("url");
  const title = req.nextUrl.searchParams.get("title") ?? "x-video";
  if (!raw) return new Response(JSON.stringify({ error: "Missing url" }), { status: 400, headers: { "content-type": "application/json" } });
  try {
    const src = new URL(raw);
    const isMp4 = src.pathname.endsWith(".mp4");
    const isHls = src.pathname.endsWith(".m3u8");
    if (!isMp4 && !isHls) {
      return new Response(JSON.stringify({ error: "Unsupported format" }), { status: 400, headers: { "content-type": "application/json" } });
    }
    const upstream = await fetch(src, {
      headers: {
        "user-agent": "Mozilla/5.0",
        "accept": "video/mp4,application/octet-stream;q=0.8,*/*;q=0.5",
        "referer": "https://x.com/",
      },
    });
    if (!upstream.ok) {
      return new Response(JSON.stringify({ error: `Upstream ${upstream.status}` }), { status: 502, headers: { "content-type": "application/json" } });
    }
    const filename = `${title.replace(/[^a-zA-Z0-9-_\. ]/g, "_").slice(0,150)}.mp4`;
    if (isMp4) {
      const headers = new Headers(upstream.headers);
      headers.set("content-disposition", `attachment; filename="${filename}"`);
      headers.set("content-type", "video/mp4");
      return new Response(upstream.body, { status: 200, headers });
    }
    // HLS: transcode to MP4 via ffmpeg
    if (!ffmpegPath) {
      return new Response(JSON.stringify({ error: "ffmpeg not available" }), { status: 500, headers: { "content-type": "application/json" } });
    }
    ffmpeg.setFfmpegPath(ffmpegPath as string);
    if (!upstream.body) {
      return new Response(JSON.stringify({ error: "No upstream body" }), { status: 502, headers: { "content-type": "application/json" } });
    }
  const readable = Readable.fromWeb(upstream.body as any) as unknown as Readable;
    const pass = new PassThrough();
    ffmpeg(readable)
      .inputOptions(["-protocol_whitelist", "file,http,https,tcp,tls,crypto"])
      .outputOptions(["-movflags", "frag_keyframe+empty_moov"])
      .format("mp4")
      .on("error", (e) => {
        try { pass.destroy(e as any); } catch {}
      })
      .pipe(pass);
    const headers = new Headers();
    headers.set("content-disposition", `attachment; filename="${filename}"`);
    headers.set("content-type", "video/mp4");
  // Convert Node stream to Web Stream for Next.js Response
  const webStream = Readable.toWeb(pass as any) as unknown as ReadableStream;
  return new Response(webStream as unknown as ReadableStream, { status: 200, headers });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || "Download failed" }), { status: 500, headers: { "content-type": "application/json" } });
  }
}

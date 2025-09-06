import { NextRequest } from "next/server";

export const runtime = "nodejs";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import { PassThrough, Readable } from "stream";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36";

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("url");
  const title = req.nextUrl.searchParams.get("title") ?? "tiktok";
  if (!raw) return new Response(JSON.stringify({ error: "Missing url" }), { status: 400, headers: { "content-type": "application/json" } });
  try {
    const src = new URL(raw);
  const range = req.headers.get("range") || undefined;
  const upstream = await fetch(src, {
      headers: {
        "user-agent": UA,
        "accept": "video/mp4,application/octet-stream;q=0.8,*/*;q=0.5",
        "referer": "https://www.tiktok.com/",
  "origin": "https://www.tiktok.com",
    ...(range ? { Range: range } : {}),
      },
      redirect: "follow",
    });
    if (!upstream.ok) {
      return new Response(JSON.stringify({ error: `Upstream ${upstream.status}` }), { status: 502, headers: { "content-type": "application/json" } });
    }
    const filename = `${title.replace(/[^a-zA-Z0-9-_\. ]/g, "_").slice(0,150)}.mp4`;
    const urlMime = src.searchParams.get("mime_type") ?? "";
    const ct = upstream.headers.get("content-type") || "";
    const path = src.pathname.toLowerCase();
    const looksMp4 = /\.mp4(\?|$)/i.test(path) || /mp4/i.test(urlMime) || /video\/mp4/i.test(ct);
    const looksHls = /\.m3u8(\?|$)/i.test(path) || /m3u8|mpegurl/i.test(urlMime) || /(application|audio)\/(x-)?mpegurl|application\/vnd\.apple\.mpegurl/i.test(ct);

    if (looksMp4) {
      const headers = new Headers(upstream.headers);
      headers.set("content-disposition", `attachment; filename="${filename}"`);
      headers.set("content-type", "video/mp4");
      return new Response(upstream.body, { status: upstream.status, headers });
    }
    if (!ffmpegPath) {
      return new Response(JSON.stringify({ error: "ffmpeg not available" }), { status: 500, headers: { "content-type": "application/json" } });
    }
    ffmpeg.setFfmpegPath(ffmpegPath as string);
    if (!upstream.body) {
      return new Response(JSON.stringify({ error: "No upstream body" }), { status: 502, headers: { "content-type": "application/json" } });
    }
    // If content-type indicates HLS (or unknown), transcode to MP4 via ffmpeg
    const readable = Readable.fromWeb(upstream.body as any) as unknown as Readable;
    const pass = new PassThrough();
    ffmpeg(readable)
      .inputOptions(["-protocol_whitelist", "file,http,https,tcp,tls,crypto"])
      .outputOptions(["-movflags", "frag_keyframe+empty_moov"])
      .format("mp4")
      .on("error", (e) => { try { pass.destroy(e as any); } catch {} })
      .pipe(pass);
    const headers = new Headers();
    headers.set("content-disposition", `attachment; filename="${filename}"`);
    headers.set("content-type", "video/mp4");
    const webStream = Readable.toWeb(pass as any) as unknown as ReadableStream;
    return new Response(webStream as unknown as ReadableStream, { status: 200, headers });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || "Download failed" }), { status: 500, headers: { "content-type": "application/json" } });
  }
}

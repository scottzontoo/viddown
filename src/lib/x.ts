export type XSource = { url: string; type?: string; quality?: string; bitrate?: number };
const DEFAULT_TIMEOUT = 8000;

function sanitizeUrl(u: string) {
  try { return new URL(u).toString(); } catch { return ""; }
}

function extractMeta(content: string, prop: string) {
  const re = new RegExp(`<meta[^>]+property=["']${prop}["'][^>]+content=["']([^"']+)["']`, "i");
  const m = content.match(re);
  return m?.[1];
}

function unique<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

function guessQualityFromPath(path: string): string | undefined {
  const m = path.match(/\/vid\/(\d+)x(\d+)\//);
  if (m) return `${m[2]}p`;
  return undefined;
}

async function fetchTextSafe(url: string, headers?: Record<string, string>, timeoutMs: number = DEFAULT_TIMEOUT) {
  try {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), timeoutMs);
    const r = await fetch(url, { headers, redirect: "follow", signal: ac.signal as any });
    clearTimeout(t);
    if (!r.ok) return "";
    return await r.text();
  } catch {
    return "";
  }
}

async function fetchJsonSafe<T = any>(url: string, headers?: Record<string, string>, timeoutMs: number = DEFAULT_TIMEOUT): Promise<T | null> {
  try {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), timeoutMs);
    const r = await fetch(url, { headers, redirect: "follow", signal: ac.signal as any });
    clearTimeout(t);
    if (!r.ok) return null as any;
    return await r.json();
  } catch {
    return null as any;
  }
}

export async function getXInfo(postUrl: string): Promise<{ title?: string; sources: XSource[] }> {
  // 1) Try public syndication API for reliable variants
  const id = parseTweetId(postUrl);
  if (id) {
    try {
      const api = `https://cdn.syndication.twimg.com/tweet-result?id=${encodeURIComponent(id)}&lang=en`;
      const j = await fetchJsonSafe<any>(api, { "user-agent": "Mozilla/5.0", "accept-language": "en" });
      if (j) {
        const title = j?.text as string | undefined;
        const variants: Array<{ type?: string; src?: string; bitrate?: number }> = j?.video?.variants || [];
        const sources: XSource[] = variants
          .filter((v) => v?.src && (v.type?.includes("mp4") || v.type?.includes("m3u8")))
          .map((v) => ({
            url: v.src!,
            type: v.type,
            bitrate: v.bitrate,
            quality: bitrateToLabel(v.bitrate),
          }))
          .sort((a, b) => (b.bitrate ?? 0) - (a.bitrate ?? 0));
        if (sources.length) return { title, sources };
      }
    } catch {
      // ignore and continue fallbacks
    }
    // 1b) Fallback: vxtwitter public API by ID
    try {
      const vx = `https://api.vxtwitter.com/Tweet/status/${id}`;
      const j2: any = await fetchJsonSafe<any>(vx, { "user-agent": "Mozilla/5.0", "accept-language": "en" });
      if (j2) {
        const title = (j2?.text || j2?.tweet?.text) as string | undefined;
        const collected: XSource[] = [];
        const pushVariant = (u?: string, t?: string, b?: number) => {
          if (!u) return;
          const type = t || (u.endsWith(".m3u8") ? "application/vnd.apple.mpegurl" : "video/mp4");
          collected.push({ url: u, type, bitrate: b, quality: bitrateToLabel(b) });
        };
        // common shapes
        if (Array.isArray(j2?.media_extended)) {
          for (const m of j2.media_extended) {
            if (Array.isArray(m?.variants)) {
              for (const v of m.variants) pushVariant(v?.src || v?.url, v?.type || v?.content_type, v?.bitrate ?? v?.bit_rate);
            }
            pushVariant(m?.url, m?.type);
          }
        }
        if (Array.isArray(j2?.variants)) {
          for (const v of j2.variants) pushVariant(v?.src || v?.url, v?.type || v?.content_type, v?.bitrate ?? v?.bit_rate);
        }
        if (typeof j2?.video_url === "string") pushVariant(j2.video_url, "video/mp4");
        if (!collected.length && Array.isArray(j2?.mediaURLs)) {
          for (const u of j2.mediaURLs) pushVariant(u, undefined);
        }
        const uniqueByUrl = Array.from(new Map(collected.map((s) => [s.url, s])).values()).sort((a, b) => (b.bitrate ?? 0) - (a.bitrate ?? 0));
        if (uniqueByUrl.length) return { title, sources: uniqueByUrl };
      }
    } catch {
      // continue
    }
    // 1c) Text-proxy fallback over vxtwitter if direct JSON failed
    try {
      const prox = `https://r.jina.ai/http://api.vxtwitter.com/Tweet/status/${id}`;
      const txt = await fetchTextSafe(prox, { "user-agent": "Mozilla/5.0", "accept-language": "en" });
      if (txt) {
        let j3: any = null;
        try { j3 = JSON.parse(txt); } catch {}
        const candidates: string[] = [];
        if (!j3) {
          const re = /https:\/\/video\.twimg\.com\/[^"]+\.(?:mp4|m3u8)[^"<\s]*/g;
          let mm: RegExpExecArray | null;
          while ((mm = re.exec(txt)) !== null) candidates.push(mm[0]);
        } else {
          const arrs: any[] = [];
          if (Array.isArray(j3?.media_extended)) arrs.push(...j3.media_extended);
          if (Array.isArray(j3?.variants)) arrs.push({ variants: j3.variants });
          for (const m of arrs) {
            if (Array.isArray(m?.variants)) {
              for (const v of m.variants) if (v?.src || v?.url) candidates.push(v.src || v.url);
            }
            if (typeof m?.url === "string") candidates.push(m.url);
          }
          if (typeof j3?.video_url === "string") candidates.push(j3.video_url);
          if (Array.isArray(j3?.mediaURLs)) candidates.push(...j3.mediaURLs);
        }
        const urls = unique(candidates.map(sanitizeUrl)).filter(Boolean);
        const mp4s = urls.filter((u) => u.endsWith(".mp4"));
        const hls = urls.filter((u) => u.endsWith(".m3u8"));
        const sources: XSource[] = mp4s.map((u) => ({ url: u, type: "video/mp4" }));
        if (!sources.length) sources.push(...hls.map((u) => ({ url: u, type: "application/vnd.apple.mpegurl" })));
        if (sources.length) return { title: undefined, sources };
      }
    } catch {
      // ignore
    }
  }

  // 2) Fallback: scrape HTML for video.twimg.com links
  const html = await fetchTextSafe(postUrl, {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122 Safari/537.36",
    "accept-language": "en,en-US;q=0.9",
  });
  const title2 = (html && (extractMeta(html, "og:title") || extractMeta(html, "twitter:title"))) || undefined;
  const candidates: string[] = [];
  const ogVideo = extractMeta(html, "og:video") || extractMeta(html, "og:video:url") || extractMeta(html, "og:video:secure_url");
  if (ogVideo && ogVideo.includes("video.twimg.com")) candidates.push(ogVideo);
  const urlRegex = /https:\/\/video\.twimg\.com\/[^"]+\.(mp4|m3u8)[^"<\s]*/g;
  let m: RegExpExecArray | null;
  while ((m = urlRegex.exec(html)) !== null) candidates.push(m[0]);
  // Additional fallbacks: i/status and mobile pages
  if (!candidates.length && id) {
    const variantsToTry = [
      `https://x.com/i/status/${id}`,
      `https://x.com/status/${id}`,
      `https://mobile.twitter.com/i/status/${id}`,
      `https://mobile.twitter.com/status/${id}`,
      `https://r.jina.ai/http://x.com/i/status/${id}`,
      `https://r.jina.ai/http://x.com/status/${id}`,
      `https://r.jina.ai/http://mobile.twitter.com/i/status/${id}`,
      `https://r.jina.ai/http://mobile.twitter.com/status/${id}`,
    ];
    for (const u of variantsToTry) {
      const txt = await fetchTextSafe(u, {
        "user-agent": "Mozilla/5.0",
        "accept-language": "en",
      });
      let mm: RegExpExecArray | null;
      while ((mm = urlRegex.exec(txt)) !== null) candidates.push(mm[0]);
      if (candidates.length) break;
    }
  }
  const urls = unique(candidates.map(sanitizeUrl)).filter(Boolean);
  const mp4s = urls.filter((u) => u.endsWith(".mp4"));
  const hls = urls.filter((u) => u.endsWith(".m3u8"));
  const sources: XSource[] = mp4s.map((u) => ({ url: u, type: "video/mp4", quality: guessQualityFromPath(new URL(u).pathname) }));
  if (!sources.length) sources.push(...hls.map((u) => ({ url: u, type: "application/vnd.apple.mpegurl", quality: guessQualityFromPath(new URL(u).pathname) })));
  return { title: title2, sources };
}

function parseTweetId(u: string): string | null {
  try {
    const url = new URL(u);
    const parts = url.pathname.split("/").filter(Boolean);
    const idx = parts.findIndex((p) => p === "status" || p === "statuses");
    if (idx !== -1 && parts[idx + 1]) {
      const id = parts[idx + 1].split("?")[0];
      return /\d+/.test(id) ? id : null;
    }
    return null;
  } catch { return null; }
}

function bitrateToLabel(b?: number): string | undefined {
  if (!b) return undefined;
  if (b >= 5_000_000) return "1080p";
  if (b >= 2_500_000) return "720p";
  if (b >= 1_000_000) return "480p";
  return undefined;
}

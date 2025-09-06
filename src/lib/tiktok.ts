export type TikTokSource = { url: string; type?: string; quality?: string };

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36";
const DEFAULT_TIMEOUT = 8000;

function uniq<T>(arr: T[]) { return Array.from(new Set(arr)); }

function getJsonBetween(content: string, startMarker: string) {
  const i = content.indexOf(startMarker);
  if (i === -1) return null;
  const start = i + startMarker.length;
  // Attempt to parse a JSON block by tracking braces
  let depth = 0;
  let end = start;
  let started = false;
  for (; end < content.length; end++) {
    const ch = content[end];
    if (!started && (ch === "{" || ch === "[")) { started = true; depth = 1; continue; }
    if (!started) continue;
    if (ch === "{" || ch === "[") depth++;
    else if (ch === "}" || ch === "]") depth--;
    if (started && depth === 0) { end++; break; }
  }
  if (!started) return null;
  try {
    const raw = content.slice(start, end);
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function extractAssignedJson(content: string, varName: string): any | null {
  // Matches window['SIGI_STATE']=<json>;</script>
  const rx = new RegExp(`${varName}\s*=\s*(\{[\s\S]*?\})\s*;\s*<`, 'i');
  const m = content.match(rx);
  if (!m) return null;
  try { return JSON.parse(m[1]); } catch { return null; }
}

async function fetchTextSafe(url: string, headers?: Record<string, string>, timeoutMs: number = DEFAULT_TIMEOUT) {
  try {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), timeoutMs);
    const r = await fetch(url, { headers, redirect: "follow", signal: ac.signal as any });
    clearTimeout(t);
    if (!r.ok) return "";
    return await r.text();
  } catch { return ""; }
}

async function fetchJsonSafe<T = any>(url: string, headers?: Record<string, string>, timeoutMs: number = DEFAULT_TIMEOUT): Promise<T | null> {
  try {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), timeoutMs);
    const r = await fetch(url, { headers, redirect: "follow", signal: ac.signal as any });
    clearTimeout(t);
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

function collectUrlsFromJson(j: any): TikTokSource[] {
  const out: TikTokSource[] = [];
  if (!j || typeof j !== "object") return out;
  // Common layouts:
  // - SIGI_STATE.ItemModule[<id>].video: { playAddr, downloadAddr, playApi, ratio, bitrate, ... }
  // - __NEXT_DATA__.props.pageProps.itemInfo.itemStruct.video: { playAddr, downloadAddr, bitrateInfo, ... }
  const candidates: any[] = [];
  if (j.ItemModule && typeof j.ItemModule === "object") {
    for (const k of Object.keys(j.ItemModule)) {
      const item = j.ItemModule[k];
      if (item?.video) candidates.push(item.video);
    }
  }
  const nextData = (j?.props && j?.pageProps) ? j : (j?.props?.pageProps ? j : null);
  if (nextData?.props?.pageProps?.itemInfo?.itemStruct?.video) {
    candidates.push(nextData.props.pageProps.itemInfo.itemStruct.video);
  }
  // Some pages embed video under detail.video
  if (j?.detail?.video) candidates.push(j.detail.video);

  // Deep scan helper: find UrlList arrays and mp4/m3u8 strings anywhere
  const visit = (obj: any) => {
    if (!obj || typeof obj !== 'object') return;
    if (Array.isArray(obj)) { for (const v of obj) visit(v); return; }
    for (const [k, v] of Object.entries(obj)) {
      if (k.toLowerCase().includes('urllist') && Array.isArray(v)) {
        for (const u of v as any[]) if (typeof u === 'string') push(u);
      } else if (typeof v === 'string' && /https?:\/\/.+\.(mp4|m3u8)(\?.*)?$/i.test(v)) {
        push(v);
      } else if (v && typeof v === 'object') {
        visit(v);
      }
    }
  };

  const push = (u?: string, t?: string, q?: string) => {
    if (!u) return;
    try { new URL(u); } catch { return; }
    const type = t || (u.endsWith(".m3u8") ? "application/vnd.apple.mpegurl" : "video/mp4");
    out.push({ url: u, type, quality: q });
  };

  for (const v of candidates) {
    if (!v) continue;
    // direct URLs
    if (typeof v.playAddr === "string") push(v.playAddr);
    if (typeof v.playAddrH264 === "string") push(v.playAddrH264);
    if (typeof v.downloadAddr === "string") push(v.downloadAddr, "video/mp4", "watermark");
    if (typeof v.h264 === "string") push(v.h264);
    if (typeof v.playApi === "string") push(v.playApi);
    // bitrateInfo array
    if (Array.isArray(v.bitrateInfo)) {
      for (const b of v.bitrateInfo) {
        const url = b?.PlayAddr?.UrlList?.[0] || b?.PlayAddr?.Url || b?.playAddr || b?.Url;
        const q = b?.QualityType || b?.Bitrate || b?.QualityLabel;
        push(url, undefined, typeof q === "number" ? `${q}` : q);
      }
    }
    // formats array
    if (Array.isArray(v.formats)) {
      for (const f of v.formats) push(f?.url, f?.mimeType, f?.qualityLabel || f?.quality);
    }
  }
  // Deep scan whole tree as a last resort
  visit(j);
  // dedupe by url
  const dedup = Array.from(new Map(out.map(s => [s.url, s])).values());
  return dedup;
}

export async function getTikTokInfo(postUrl: string): Promise<{ title?: string; sources: TikTokSource[] }> {
  // Normalize to main domain page if short link
  let html = await fetchTextSafe(postUrl, {
    "user-agent": UA,
    "accept-language": "en",
    "referer": "https://www.tiktok.com/",
  });
  if (!html) {
    // Try a mirror text proxy to bypass JS/region blocks
    html = await fetchTextSafe(`https://r.jina.ai/http://www.tiktok.com/${postUrl.replace(/^https?:\/\/[^/]+\//i,'')}`, {
      "user-agent": UA,
      "accept-language": "en",
    });
  }
  if (!html) return { title: undefined, sources: [] };
  // Extract title
  let title: string | undefined = undefined;
  const mt = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i);
  if (mt) title = mt[1];
  // Try SIGI_STATE JSON
  let sources: TikTokSource[] = [];
  const sigi = getJsonBetween(html, '<script id="SIGI_STATE" type="application/json">');
  if (sigi) sources.push(...collectUrlsFromJson(sigi));
  if (!sigi) {
    const assigned = extractAssignedJson(html, "window\\['SIGI_STATE'\\]");
    if (assigned) sources.push(...collectUrlsFromJson(assigned));
  }
  // Try __NEXT_DATA__ JSON
  const nextData = getJsonBetween(html, '<script id="__NEXT_DATA__" type="application/json">');
  if (nextData) sources.push(...collectUrlsFromJson(nextData));
  // Try any JSON-LD blocks (unlikely to include direct video but cheap)
  const jsonLdRx = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = jsonLdRx.exec(html)) !== null) {
    try { const jd = JSON.parse(m[1]); sources.push(...collectUrlsFromJson(jd)); } catch {}
  }
  // Also scrape any video CDN links found
  const linkRx = /https:\/\/[^\s"']+\.(?:mp4|m3u8)(?:\?[^\s"'<]*)?/gi;
  const rawLinks = html.match(linkRx) || [];
  for (const u of rawLinks) {
    try { new URL(u); sources.push({ url: u, type: u.endsWith(".m3u8") ? "application/vnd.apple.mpegurl" : "video/mp4" }); } catch {}
  }
  // Finalize and prefer unique
  const unique = Array.from(new Map(sources.map(s => [s.url, s])).values());
  // Heuristic: prefer URLs that include v16, v19 (common TikTok video CDNs)
  unique.sort((a, b) => Number(/v1(6|9)/.test(b.url)) - Number(/v1(6|9)/.test(a.url)));
  if (unique.length) return { title, sources: unique };

  // Fallback: TikWM public API
  try {
    const api = `https://www.tikwm.com/api/?url=${encodeURIComponent(postUrl)}&hd=1`;
    const j = await fetchJsonSafe<any>(api, { "user-agent": UA, "accept-language": "en" }, 10000);
    if (j && j.code === 0 && j.data) {
      const d = j.data;
      const out: TikTokSource[] = [];
      if (typeof d.hdplay === "string") out.push({ url: d.hdplay, type: "video/mp4", quality: "HD" });
      if (typeof d.play === "string") out.push({ url: d.play, type: "video/mp4" });
      if (typeof d.wmplay === "string") out.push({ url: d.wmplay, type: "video/mp4", quality: "watermark" });
      // Some responses include HLS too
      if (typeof d.hls_url === "string") out.push({ url: d.hls_url, type: "application/vnd.apple.mpegurl" });
      const dedup = Array.from(new Map(out.map(s => [s.url, s])).values());
      const ttl = (typeof d.title === "string" && d.title) ? d.title : title;
      if (dedup.length) return { title: ttl, sources: dedup };
    }
  } catch {}

  // Mirror fallback for TikWM via text proxy
  try {
    const prox = `https://r.jina.ai/http://www.tikwm.com/api/?url=${encodeURIComponent(postUrl)}&hd=1`;
    const txt = await fetchTextSafe(prox, { "user-agent": UA, "accept-language": "en" }, 10000);
    if (txt) {
      let j2: any = null;
      try { j2 = JSON.parse(txt); } catch {}
      if (j2 && j2.code === 0 && j2.data) {
        const d = j2.data;
        const out: TikTokSource[] = [];
        if (typeof d.hdplay === "string") out.push({ url: d.hdplay, type: "video/mp4", quality: "HD" });
        if (typeof d.play === "string") out.push({ url: d.play, type: "video/mp4" });
        if (typeof d.wmplay === "string") out.push({ url: d.wmplay, type: "video/mp4", quality: "watermark" });
        if (typeof d.hls_url === "string") out.push({ url: d.hls_url, type: "application/vnd.apple.mpegurl" });
        const dedup = Array.from(new Map(out.map(s => [s.url, s])).values());
        const ttl = (typeof d.title === "string" && d.title) ? d.title : title;
        if (dedup.length) return { title: ttl, sources: dedup };
      }
    }
  } catch {}

  return { title, sources: [] };
}

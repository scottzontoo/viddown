export type InstagramSource = { url: string; type?: string; quality?: string };

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36";
const MOBILE_UA = "Mozilla/5.0 (Linux; Android 11; SAMSUNG SM-G973U) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/14.2 Chrome/87.0.4280.141 Mobile Safari/537.36";
const DEFAULT_TIMEOUT = 8000;
const IG_APP_ID = "936619743392459";
// Additional Web App ID commonly used by Instagram web GraphQL
const IG_WEB_APP_ID = process.env.IG_WEB_APP_ID || "1217981644879628";
// These tokens can change; allow override via env to avoid hardcoding when deploying.
const IG_LSD = process.env.IG_LSD || "AVrqPT0gJDo";
const IG_ASBD_ID = process.env.IG_ASBD_ID || "359341";
const IG_BLOKS_VERSION = process.env.IG_BLOKS_VERSION ||
  "0d99de0d13662a50e0958bcb112dd651f70dea02e1859073ab25f8f2a477de96";
// GraphQL doc id for PolarisPostActionLoadPostQueryQuery (subject to change)
const IG_DOC_ID = process.env.IG_DOC_ID || "8845758582119845";

function uniq<T>(arr: T[]) { return Array.from(new Set(arr)); }

function withIgCookie(headers?: Record<string, string>) {
  const h = { ...(headers || {}) } as Record<string, string>;
  const cookie = process.env.INSTAGRAM_COOKIE;
  if (cookie) h["cookie"] = cookie;
  return h;
}

async function fetchTextSafe(url: string, headers?: Record<string, string>, timeoutMs: number = DEFAULT_TIMEOUT) {
  try {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), timeoutMs);
    const r = await fetch(url, { headers: withIgCookie(headers), redirect: "follow", signal: ac.signal as any });
    clearTimeout(t);
    if (!r.ok) return "";
    return await r.text();
  } catch { return ""; }
}

async function fetchJsonSafe<T = any>(url: string, headers?: Record<string, string>, timeoutMs: number = DEFAULT_TIMEOUT): Promise<T | null> {
  try {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), timeoutMs);
    const r = await fetch(url, { headers: withIgCookie(headers), redirect: "follow", signal: ac.signal as any });
    clearTimeout(t);
    if (!r.ok) return null;
    return await r.json();
  } catch { return null; }
}

function parseShortcode(u: string): string | null {
  try {
    const url = new URL(u);
    const parts = url.pathname.split('/').filter(Boolean);
    const idx = parts.findIndex(p => p === 'p' || p === 'reel' || p === 'tv');
    if (idx !== -1 && parts[idx + 1]) return parts[idx + 1];
    return null;
  } catch { return null; }
}

function extractMeta(content: string, prop: string) {
  const re = new RegExp(`<meta[^>]+property=["']${prop}["'][^>]+content=["']([^"']+)["']`, "i");
  const m = content.match(re);
  return m?.[1];
}

function collectFromAnyJson(j: any): InstagramSource[] {
  const out: InstagramSource[] = [];
  const push = (u?: string, t?: string) => {
    if (!u) return;
    try { new URL(u); } catch { return; }
    out.push({ url: u, type: t || (u.endsWith('.m3u8') ? 'application/vnd.apple.mpegurl' : 'video/mp4') });
  };
  const visit = (o: any) => {
    if (!o || typeof o !== 'object') return;
    if (Array.isArray(o)) { for (const v of o) visit(v); return; }
    if (typeof (o as any).video_url === 'string') push((o as any).video_url, 'video/mp4');
    if (Array.isArray((o as any).video_versions)) for (const v of (o as any).video_versions) push(v?.url, 'video/mp4');
    for (const [k, v] of Object.entries(o)) {
      if (typeof v === 'string' && /https?:\/\/[^\s"']+\.(mp4|m3u8)(\?[^\s"'<]*)?/i.test(v)) push(v);
      else if (v && typeof v === 'object') visit(v);
    }
  };
  visit(j);
  return Array.from(new Map(out.map(s => [s.url, s])).values());
}

async function postFormSafe<T = any>(url: string, body: URLSearchParams, headers?: Record<string, string>, timeoutMs: number = DEFAULT_TIMEOUT, referrerUrl?: string): Promise<Response | null> {
  try {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), timeoutMs);
    const r = await fetch(url, {
      method: "POST",
      body,
      headers: withIgCookie({
        "content-type": "application/x-www-form-urlencoded",
        ...headers,
      }),
      redirect: "follow",
      signal: ac.signal as any,
      // include a referrer similar to the target post
      referrer: referrerUrl,
    });
    clearTimeout(t);
    return r;
  } catch {
    return null;
  }
}

async function tryGraphQLByShortcode(shortcode: string): Promise<{ title?: string; sources: InstagramSource[] } | null> {
  // Construct GraphQL form body similar to the reference project
  const variables = { shortcode, fetch_tagged_user_count: null, hoisted_comment_id: null, hoisted_reply_id: null };
  const form = new URLSearchParams();
  form.set("av", "0");
  form.set("__d", "www");
  form.set("__user", "0");
  form.set("__a", "1");
  form.set("__req", "g");
  form.set("__hs", "20183.HYP:instagram_web_pkg.2.1");
  form.set("dpr", "2");
  form.set("__ccg", "GOOD");
  form.set("__rev", "1021613311");
  form.set("__s", "x0losd:ztapmw:hm5eih");
  form.set("__hsi", "7489787314313612244");
  form.set("__comet_req", "7");
  form.set("lsd", IG_LSD);
  form.set("jazoest", "2952");
  form.set("__spin_r", "1021613311");
  form.set("__spin_b", "trunk");
  form.set("__spin_t", `${Math.floor(Date.now() / 1000)}`);
  form.set("__crn", "comet.igweb.PolarisPostRoute");
  form.set("fb_api_caller_class", "RelayModern");
  form.set("fb_api_req_friendly_name", "PolarisPostActionLoadPostQueryQuery");
  form.set("variables", JSON.stringify(variables));
  form.set("server_timestamps", "true");
  form.set("doc_id", IG_DOC_ID);

  const headers = {
    "user-agent": MOBILE_UA,
    Accept: "*/*",
    "accept-language": "en-US,en;q=0.5",
    "X-IG-App-ID": IG_WEB_APP_ID,
    "X-ASBD-ID": IG_ASBD_ID,
    "X-FB-LSD": IG_LSD,
    "X-BLOKS-VERSION-ID": IG_BLOKS_VERSION,
    ...(process.env.IG_CSRF ? { "X-CSRFToken": process.env.IG_CSRF } : {}),
    Pragma: "no-cache",
    "Cache-Control": "no-cache",
  } as Record<string, string>;

  const resp = await postFormSafe(
    "https://www.instagram.com/graphql/query",
    form,
    headers,
    12000,
    `https://www.instagram.com/p/${shortcode}/`
  );
  if (!resp) return null;
  if (resp.status === 404) return { title: undefined, sources: [] };
  if (resp.status === 429 || resp.status === 401) return { title: undefined, sources: [] };
  if (!resp.ok) return null;

  try {
    const j = await resp.json() as any;
    const media = j?.data?.xdt_shortcode_media;
    if (!media) return null;
    if (media?.is_video && typeof media?.video_url === "string") {
      const title = media?.title || media?.edge_media_to_caption?.edges?.[0]?.node?.text;
      return { title, sources: [{ url: media.video_url, type: "video/mp4" }] };
    }
    // Also check possible video_versions
    const sources: InstagramSource[] = [];
    if (Array.isArray(media?.video_versions)) {
      for (const v of media.video_versions) if (v?.url) sources.push({ url: v.url, type: "video/mp4" });
    }
    if (sources.length) return { title: media?.title, sources };
  } catch {}
  return null;
}

export async function getInstagramInfo(postUrl: string): Promise<{ title?: string; sources: InstagramSource[] }> {
  const headers = {
    "user-agent": UA,
    "accept-language": "en",
    "referer": "https://www.instagram.com/",
  } as Record<string, string>;

  // Prefer GraphQL by shortcode early (fast path), then fall back to HTML/JSON parsing
  try {
    const code = parseShortcode(postUrl);
    if (code) {
      const gql = await tryGraphQLByShortcode(code);
      if (gql && gql.sources.length) return gql;
    }
  } catch {}

  let html = await fetchTextSafe(postUrl, headers);
  if (!html) {
    // Try mirror proxy to bypass JS/geo blocks
    const path = postUrl.replace(/^https?:\/\/[^/]+\//i, "");
    html = await fetchTextSafe(`https://r.jina.ai/http://www.instagram.com/${path}`, { "user-agent": UA, "accept-language": "en" });
  }
  if (!html) return { title: undefined, sources: [] };

  const title = extractMeta(html, "og:title") || extractMeta(html, "twitter:title") || undefined;

  const sources: InstagramSource[] = [];
  const push = (u?: string, t?: string, q?: string) => {
    if (!u) return;
    try { new URL(u); } catch { return; }
    const type = t || (u.endsWith(".m3u8") ? "application/vnd.apple.mpegurl" : "video/mp4");
    sources.push({ url: u, type, quality: q });
  };

  // 1) Direct video_url in page JSON (accepts escaped or normal URLs)
  const videoUrlRx = /"video_url"\s*:\s*"([^"]+\.mp4[^"]*)"/i;
  const vm = html.match(videoUrlRx);
  if (vm) push(vm[1].replace(/\\u0026/g, "&").replace(/\\\//g, "/"), "video/mp4");

  // 2) video_versions array: { url, type, width, height }
  const versionsRx = /"video_versions"\s*:\s*\[(\{[\s\S]*?\})\]/i;
  const vv = versionsRx.exec(html);
  if (vv) {
    const block = vv[0];
    const urlRx = /"url"\s*:\s*"([^"]+\.mp4[^"]*)"/g;
    let m: RegExpExecArray | null;
    while ((m = urlRx.exec(block)) !== null) push(m[1].replace(/\\u0026/g, "&").replace(/\\\//g, "/"), "video/mp4");
  }

  // 3) DASH/HLS manifest references
  const hlsRx = /https?:\/\/[^"\\]+\.m3u8[^"\\]*/gi;
  let hm: RegExpExecArray | null;
  while ((hm = hlsRx.exec(html)) !== null) push((hm[0] as string).replace(/\\u0026/g, "&").replace(/\\\//g, "/"), "application/vnd.apple.mpegurl");

  // 4) Fallback: scan for any direct .mp4 in the page
  const mp4Rx = /https?:\/\/[^\s"']+\.mp4(?:\?[^\s"'<]*)?/gi;
  const mp4s = html.match(mp4Rx) || [];
  for (const u of mp4s) push(u, "video/mp4");

  // 5) window.__additionalDataLoaded JSON blocks
  const addlRx = /window\.__additionalDataLoaded\([^,]+,\s*(\{[\s\S]*?\})\s*\);/g;
  let am: RegExpExecArray | null;
  while ((am = addlRx.exec(html)) !== null) {
    try { const j = JSON.parse(am[1]); sources.push(...collectFromAnyJson(j)); } catch {}
  }

  // Dedupe
  const unique = Array.from(new Map(sources.map(s => [s.url, s])).values());
  if (unique.length) return { title, sources: unique };

  // Fallback 1: Official JSON endpoint (__a=1)
  try {
  const a1 = await fetchJsonSafe<any>(postUrl.replace(/[#?].*$/, '') + '?__a=1&__d=dis', { ...headers, 'x-ig-app-id': IG_APP_ID }, 10000);
    if (a1) {
      const out: InstagramSource[] = [];
      // GraphQL style
      const media = a1?.graphql?.shortcode_media;
      if (media) {
        if (typeof media?.video_url === 'string') out.push({ url: media.video_url, type: 'video/mp4' });
        if (Array.isArray(media?.video_versions)) for (const v of media.video_versions) if (v?.url) out.push({ url: v.url, type: 'video/mp4' });
      }
      // IgApi style
      const items = a1?.items;
      if (Array.isArray(items) && items[0]?.video_versions) {
        for (const v of items[0].video_versions) if (v?.url) out.push({ url: v.url, type: 'video/mp4' });
      }
      const dedupA1 = Array.from(new Map(out.map(s => [s.url, s])).values());
      if (dedupA1.length) return { title: title ?? a1?.seo?.title ?? a1?.title, sources: dedupA1 };
    }
  } catch {}

  // Fallback 1b: Proxied __a=1 via r.jina.ai
  try {
    const clean = postUrl.replace(/[#?].*$/, '');
  const prox = `https://r.jina.ai/http://www.instagram.com${new URL(clean).pathname}?__a=1&__d=dis`;
  const txt = await fetchTextSafe(prox, { 'user-agent': UA, 'accept-language': 'en', 'x-ig-app-id': IG_APP_ID }, 10000);
    if (txt) {
      let j: any = null;
      try { j = JSON.parse(txt); } catch {}
      if (j) {
        const out: InstagramSource[] = [];
        const push = (u?: string) => { if (typeof u === 'string') out.push({ url: u, type: u.endsWith('.m3u8') ? 'application/vnd.apple.mpegurl' : 'video/mp4' }); };
        const media = j?.graphql?.shortcode_media;
        if (media) {
          push(media.video_url);
          if (Array.isArray(media?.video_versions)) for (const v of media.video_versions) push(v?.url);
        }
        const items = j?.items;
        if (Array.isArray(items) && items[0]?.video_versions) for (const v of items[0].video_versions) push(v?.url);
        const dedup = Array.from(new Map(out.map(s => [s.url, s])).values());
        if (dedup.length) return { title, sources: dedup };
      }
    }
  } catch {}

  // Fallback 2: ddinstagram mirror
  try {
    const code = parseShortcode(postUrl);
    if (code) {
      const dd = await fetchTextSafe(`https://ddinstagram.com/reel/${code}/`, { 'user-agent': UA, 'accept-language': 'en' }, 10000);
      const ddHtml = dd || await fetchTextSafe(`https://r.jina.ai/http://ddinstagram.com/reel/${code}/`, { 'user-agent': UA, 'accept-language': 'en' }, 10000);
      if (ddHtml) {
        const metaVid = extractMeta(ddHtml, 'og:video') || extractMeta(ddHtml, 'og:video:secure_url');
        const out: InstagramSource[] = [];
        if (metaVid) out.push({ url: metaVid, type: 'video/mp4' });
        const rx = /https?:\/\/[^\s"']+\.mp4(?:\?[^\s"'<]*)?/gi;
        const found = ddHtml.match(rx) || [];
        for (const u of found) out.push({ url: u, type: 'video/mp4' });
        const dedup = Array.from(new Map(out.map(s => [s.url, s])).values());
        if (dedup.length) return { title, sources: dedup };
      }
    }
  } catch {}

  // Fallback 4: api/v1/media/shortcode endpoint with X-IG-App-ID
  try {
    const code = parseShortcode(postUrl);
    if (code) {
      // Mobile API (often less restrictive)
      const mapi = `https://i.instagram.com/api/v1/media/shortcode/${code}/`;
      const a0 = await fetchJsonSafe<any>(mapi, { 'user-agent': MOBILE_UA, 'accept-language': 'en', 'x-ig-app-id': IG_APP_ID }, 10000);
      if (a0) {
        const out0 = collectFromAnyJson(a0);
        if (out0.length) return { title, sources: out0 };
      }
      const api = `https://www.instagram.com/api/v1/media/shortcode/${code}/?__a=1&__d=dis`;
      const a = await fetchJsonSafe<any>(api, { ...headers, 'x-ig-app-id': IG_APP_ID }, 10000);
      if (a) {
        const out = collectFromAnyJson(a);
        if (out.length) return { title, sources: out };
      }
      // proxy
      const prox = `https://r.jina.ai/http://www.instagram.com/api/v1/media/shortcode/${code}/?__a=1&__d=dis`;
      const txt = await fetchTextSafe(prox, { ...headers, 'x-ig-app-id': IG_APP_ID }, 10000);
      if (txt) {
        try { const j = JSON.parse(txt); const out = collectFromAnyJson(j); if (out.length) return { title, sources: out }; } catch {}
      }
    }
  } catch {}

  // Fallback 3: ddinstagram API (JSON) direct and proxied
  try {
    const api = `https://ddinstagram.com/api?url=${encodeURIComponent(postUrl)}`;
    const j = await fetchJsonSafe<any>(api, { 'user-agent': UA, 'accept-language': 'en' }, 10000);
    if (j) {
      const urls: string[] = [];
      const visit = (o: any) => {
        if (!o || typeof o !== 'object') return;
        if (Array.isArray(o)) { for (const v of o) visit(v); return; }
        for (const [k, v] of Object.entries(o)) {
          if (typeof v === 'string' && /https?:\/\/[^\s"']+\.(mp4|m3u8)(\?[^\s"'<]*)?/i.test(v)) urls.push(v);
          else if (v && typeof v === 'object') visit(v);
        }
      };
      visit(j);
      const out = Array.from(new Set(urls)).map(u => ({ url: u, type: u.endsWith('.m3u8') ? 'application/vnd.apple.mpegurl' : 'video/mp4' as const }));
      if (out.length) return { title, sources: out };
    }
  } catch {}
  try {
    const prox = `https://r.jina.ai/http://ddinstagram.com/api?url=${encodeURIComponent(postUrl)}`;
    const txt = await fetchTextSafe(prox, { 'user-agent': UA, 'accept-language': 'en' }, 10000);
    if (txt) {
      let j2: any = null;
      try { j2 = JSON.parse(txt); } catch {}
      if (j2) {
        const urls: string[] = [];
        const visit = (o: any) => {
          if (!o || typeof o !== 'object') return;
          if (Array.isArray(o)) { for (const v of o) visit(v); return; }
          for (const [k, v] of Object.entries(o)) {
            if (typeof v === 'string' && /https?:\/\/[^\s"']+\.(mp4|m3u8)(\?[^\s"'<]*)?/i.test(v)) urls.push(v);
            else if (v && typeof v === 'object') visit(v);
          }
        };
        visit(j2);
        const out = Array.from(new Set(urls)).map(u => ({ url: u, type: u.endsWith('.m3u8') ? 'application/vnd.apple.mpegurl' : 'video/mp4' as const }));
        if (out.length) return { title, sources: out };
      }
    }
  } catch {}

  return { title, sources: [] };
}

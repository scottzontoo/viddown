"use client";
import { useMemo, useState } from "react";

type ResolvedMedia = {
  title?: string;
  thumbnails?: string[];
  sources: Array<{ quality?: string; type?: string; url: string }>;
  provider: string;
};

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResolvedMedia | null>(null);

  const canSubmit = useMemo(() => /^https?:\/\//i.test(url), [url]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (!canSubmit) return;
    setLoading(true);
    try {
  const res = await fetch("/api/resolve?url=" + encodeURIComponent(url));
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || "Failed to resolve video");
  const data = json as ResolvedMedia;
      setResult(data);
    } catch (err: any) {
      setError(err?.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container-2xl pb-16">
      <section className="py-16 sm:py-24">
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight">Social Media Video Downloader</h1>
          <p className="mt-3 text-[rgb(var(--muted))]">Paste a video link from TikTok, YouTube, or X (Twitter). We’ll fetch available qualities for quick, no signup required, no watermarks.</p>
        </div>

        <form onSubmit={onSubmit} className="mt-8 flex flex-col sm:flex-row gap-3">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.tiktok.com/..."
              className="flex-1 rounded-md border border-zinc-200 bg-white px-4 py-3 shadow-sm outline-none focus:ring-2 focus:ring-[rgb(var(--ring))] text-zinc-900 placeholder-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-400"
            inputMode="url"
          />
          <button
            disabled={!canSubmit || loading}
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-5 py-3 font-medium text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-50"
          >
            {loading ? "Resolving…" : "Get links"}
          </button>
        </form>

        <div className="mt-4 text-xs text-[rgb(var(--muted))] flex items-center gap-2">
          <Badge text="TikTok" color="bg-black" />
          <Badge text="YouTube" color="bg-red-600" />
          <Badge text="X" color="bg-zinc-900" />
        </div>

        {error && (
          <div className="mt-6 rounded-md border border-red-300/40 bg-red-50 px-4 py-3 text-red-700 dark:border-red-900/40 dark:bg-red-950 dark:text-red-300">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-10 grid gap-4">
            {result.title && <h2 className="text-xl font-semibold">{result.title}</h2>}
            <div className="grid gap-3 sm:grid-cols-2">
              {result.sources.map((s, i) => (
                <a
                  key={i}
                  href={s.url}
                    className="flex items-center justify-between rounded-md border border-zinc-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{s.quality ?? s.type ?? "Download"}</span>
                    <span className="text-xs text-[rgb(var(--muted))]">{result.provider}</span>
                  </div>
                  <span className="text-indigo-600 text-sm">Download</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function Badge({ text, color }: { text: string; color: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-medium text-white ${color}`}>
      {text}
    </span>
  );
}

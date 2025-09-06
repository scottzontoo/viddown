# VidDown

Sleek Next.js app to resolve and download videos from TikTok, YouTube, and X. Uses Tailwind CSS v4 and the Next.js App Router.
Backend uses real extractors with Node.js runtime, including HLS→MP4 conversion when needed.

## Getting Started

Windows PowerShell commands:

```
npm install
npm run dev
```

Open http://localhost:3000 and paste a video URL to test.

## Project structure

- `src/app/page.tsx` – Home UI with URL input and results.
- `src/app/api/resolve/route.ts` – Provider detection and resolve orchestration.
- `src/app/api/youtube/download/route.ts` – YouTube streaming by itag.
- `src/app/api/x/download/route.ts` – X/Twitter MP4 direct or HLS→MP4.
- `src/app/api/tiktok/download/route.ts` – TikTok MP4 direct or HLS→MP4.
- `src/app/layout.tsx` – Root layout and Chrome.
- `src/app/globals.css` – Tailwind v4 styles.

## Legal

Use only for lawful, personal use. Respect each platform’s Terms of Service. This tool does not circumvent DRM.

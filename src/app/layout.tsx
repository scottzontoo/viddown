import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "VidDown • Social Media Video Downloader",
    template: "%s • VidDown",
  },
  description:
    "Free online downloader for TikTok, YouTube, and X (Twitter). Paste a link to get fast, watermark‑free video downloads in multiple qualities.",
  manifest: "/site.webmanifest",
  icons: {
    icon: "/video.png",
    apple: "/video.png",
  },
  keywords: [
    "video downloader",
    "tiktok downloader",
    "youtube downloader",
    "twitter downloader",
    "x downloader",
    "save video online",
    "download social media videos",
  ],
  authors: [{ name: "MassData x NIJverse" }],
  openGraph: {
    title: "VidDown • Social Media Video Downloader",
    description:
      "Download videos from TikTok, YouTube, and X (Twitter) quickly and for free. Paste a link, get multiple qualities.",
  url: "https://api.massdatagh.com/",
    siteName: "VidDown",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VidDown • Social Media Video Downloader",
    description:
      "Free, fast downloader for TikTok, YouTube, and X (Twitter). Paste a link to get download options.",
  },
  alternates: {
  canonical: "https://api.massdatagh.com/",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-NDJG2WXKZ9"
          strategy="afterInteractive"
        />
        <Script id="ga-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-NDJG2WXKZ9');
          `}
        </Script>
        <div className="container-2xl py-8">
          <header className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-md bg-indigo-600" aria-label="Site logo" />
              <span className="font-semibold text-lg text-indigo-700">VidDown</span>
            </div>
            <nav className="text-sm text-[rgb(var(--muted))] flex items-center gap-6">
              <a className="hover:text-indigo-600" href="https://prize.massdatagh.com" target="_blank" rel="noreferrer">Prize</a>
              <a className="hover:text-indigo-600" href="https://massdatagh.com/buy-data" target="_blank" rel="noreferrer">Buy Data</a>
            </nav>
          </header>
        </div>
        {children}
        <footer className="container-2xl py-12 text-sm text-[rgb(var(--muted))]">
          <div className="space-y-2">
            <p>
              Use for personal, lawful purposes only. Respect platform Terms. This tool does not
              circumvent DRM. Read our <a className="underline hover:text-indigo-600" href="/tos">Terms &amp; Conditions</a>.
            </p>
            <p>
              VidDown is a fast, free online tool built by <a className="underline hover:text-indigo-600" href="https://massdatagh.com" target="_blank" rel="noreferrer">MassData</a> and NIJverse Team to help you save videos in MP4 from
              your favorite social media platforms. No signup required, no watermarks. Visit <a className="underline hover:text-indigo-600" href="https://api.massdatagh.com" target="_blank" rel="noreferrer">api.massdatagh.com</a>.
            </p>
          </div>
        </footer>
        {/* Ad script below footer */}
        <Script id="hpformat-opts" strategy="afterInteractive">
          {`
            atOptions = {
              key: 'a4427b44894f9b851e4eb349cba19972',
              format: 'iframe',
              height: 50,
              width: 320,
              params: {}
            };
          `}
        </Script>
        <Script
          id="hpformat-invoke"
          src="https://www.highperformanceformat.com/a4427b44894f9b851e4eb349cba19972/invoke.js"
          strategy="afterInteractive"
        />
        <Script
          id="revenuecpmgate"
          src="//pl27597134.revenuecpmgate.com/2f/b6/49/2fb64931b441b74d110320a45b067ce6.js"
          strategy="afterInteractive"
        />
        <Script
          id="revenuecpmgate-key"
          src="https://www.revenuecpmgate.com/jpw10pkrz?key=ed1f05d49ba2bc493efeeaa4e7ff63b0"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}

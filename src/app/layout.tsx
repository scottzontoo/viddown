import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VidDown • Fast video downloads",
  description: "Download videos from TikTok, YouTube, and X (Twitter) in one place.",
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">
        <div className="container-2xl py-8">
          <header className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-md bg-indigo-600" />
              <span className="font-semibold tracking-tight">VidDown</span>
            </div>
            <nav className="text-sm text-[rgb(var(--muted))]">
              <a className="hover:text-indigo-600" href="https://github.com/" target="_blank" rel="noreferrer">GitHub</a>
            </nav>
          </header>
        </div>
        {children}
        <footer className="container-2xl py-12 text-sm text-[rgb(var(--muted))]">
          <p>
            Use for personal, lawful purposes only. Respect platform Terms. This tool does not
            circumvent DRM.
          </p>
        </footer>
      </body>
    </html>
  );
}

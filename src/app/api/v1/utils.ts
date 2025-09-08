// Helper functions for API routes

/**
 * Detects the provider (platform) based on the URL
 * @param u The URL to analyze
 * @returns The detected provider or "unknown"
 */
export function detectProvider(u: string): "tiktok" | "youtube" | "x" | "unknown" {
  try {
    const host = new URL(u).host.replace(/^www\./, "");
    if (host.includes("tiktok.com")) return "tiktok";
    if (host.includes("youtube.com") || host.includes("youtu.be")) return "youtube";
    if (host === "x.com" || host.includes("twitter.com")) return "x";
    return "unknown";
  } catch {
    return "unknown";
  }
}

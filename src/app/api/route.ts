import { NextRequest, NextResponse } from "next/server";

/**
 * Service root - returns API information
 */
export function GET(req: NextRequest) {
  const baseUrl = req.nextUrl.origin;

  return NextResponse.json({
    name: "VidDown API",
    version: "1.0.0",
    description: "Social media video downloader API supporting YouTube, TikTok, and X (Twitter)",
    baseUrl: `${baseUrl}/api`,
    endpoints: {
      map: `${baseUrl}/api/map`,
      resolve: `${baseUrl}/api/resolve`,
      download: `${baseUrl}/api/download`,
      docs: `${baseUrl}/documentation/api`
    },
    supportedPlatforms: ["YouTube", "TikTok", "X (Twitter)"],
    features: [
      "Video metadata resolution",
      "Multiple quality options",
      "Direct download streaming",
      "Fallback to external API"
    ]
  });
}

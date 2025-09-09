import { NextRequest, NextResponse } from "next/server";

/**
 * Machine-readable endpoint list
 */
export function GET(req: NextRequest) {
  const baseUrl = req.nextUrl.origin;

  return NextResponse.json({
    endpoints: [
      {
        path: "/",
        method: "GET",
        description: "Service root (JSON)",
        parameters: []
      },
      {
        path: "/documentation/api",
        method: "GET",
        description: "HTML documentation",
        parameters: []
      },
      {
        path: "/api/map",
        method: "GET",
        description: "Machine-readable endpoint list",
        parameters: []
      },
      {
        path: "/api/resolve",
        method: "GET",
        description: "Resolve metadata & sources (YT/TikTok/X)",
        parameters: [
          {
            name: "url",
            type: "string",
            required: true,
            description: "The URL of the video to resolve"
          }
        ]
      },
      {
        path: "/api/download",
        method: "GET",
        description: "Unified best-quality download",
        parameters: [
          {
            name: "url",
            type: "string",
            required: true,
            description: "The URL of the video to download"
          }
        ]
      }
    ]
  });
}

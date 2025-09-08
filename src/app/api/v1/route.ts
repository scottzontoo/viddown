import { NextRequest, NextResponse } from "next/server";

/**
 * Redirects to the API documentation page
 */
export function GET(req: NextRequest) {
  return NextResponse.redirect(new URL("/documentation/api", req.nextUrl.origin));
}

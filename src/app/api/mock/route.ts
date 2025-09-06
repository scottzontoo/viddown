import { NextRequest } from "next/server";

// Returns a tiny text payload as a stand-in for a real file stream.
export async function GET(req: NextRequest) {
  const u = req.nextUrl.searchParams.get("u") ?? "";
  const q = req.nextUrl.searchParams.get("q");
  const t = req.nextUrl.searchParams.get("t");
  const content = `Mock download for: ${u}\nQuality: ${q ?? "n/a"}\nType: ${t ?? "video"}`;
  return new Response(content, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "content-disposition": "attachment; filename=mock.txt",
    },
  });
}

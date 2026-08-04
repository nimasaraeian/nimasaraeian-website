import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const sourceUrl = new URL("/nima-os-independent-v1.html", request.url);
  const source = await fetch(sourceUrl, { cache: "no-store" });
  if (!source.ok) {
    return new Response("Nima OS source is unavailable", { status: 503 });
  }

  let html = await source.text();
  html = html
    .replace(/<title>.*?<\/title>/i, "<title>Nima OS</title>")
    .replace(
      "</head>",
      '<link rel="manifest" href="/nima-os-independent.webmanifest?v=6"><link rel="apple-touch-icon" href="/favicon.png?v=nima-os-v6"></head>',
    )
    .replace(
      "</body>",
      '<script src="/nima-os-notifications-v2.js?v=20260804-custom-1"></script><script src="/nima-os-health-proxy.js?v=20260805-2"></script><script src="/nima-os-health-bridge.js?v=20260805-2"></script><script src="/nima-os-health-feedback.js?v=20260805-2"></script></body>',
    );

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
      Pragma: "no-cache",
      Expires: "0",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

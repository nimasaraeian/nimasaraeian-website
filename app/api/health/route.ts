import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UPSTREAM = "https://qmlacuiguaryobzoryyn.supabase.co/functions/v1/nima-health";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const upstream = await fetch(UPSTREAM, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      cache: "no-store",
    });

    const responseBody = await upstream.text();

    return new Response(responseBody, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("content-type") || "application/json; charset=utf-8",
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      },
    });
  } catch {
    return Response.json(
      { error: "ارتباط با سرویس Apple Health برقرار نشد." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}

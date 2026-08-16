import { NextRequest, NextResponse } from "next/server";

const WEBAPP_URL = process.env.GOOGLE_SHEETS_WEBAPP_URL;

export async function GET() {
  if (!WEBAPP_URL) {
    return NextResponse.json({ count: null }, { status: 200 });
  }

  try {
    const res = await fetch(WEBAPP_URL, { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ count: null }, { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  if (!WEBAPP_URL) {
    return NextResponse.json(
      { error: "Allowlist isn't configured yet. Set GOOGLE_SHEETS_WEBAPP_URL." },
      { status: 503 }
    );
  }

  let body: { handle?: string; wallet?: string; inviteCode?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const handle = String(body.handle || "").trim();
  const wallet = String(body.wallet || "").trim();
  const inviteCode = String(body.inviteCode || "").trim();

  if (!handle || !wallet || !inviteCode) {
    return NextResponse.json(
      { error: "Missing handle, wallet, or inviteCode." },
      { status: 400 }
    );
  }

  try {
    const upstream = await fetch(WEBAPP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ handle, wallet, inviteCode }),
    });
    const data = await upstream.json();

    if (data.error) {
      return NextResponse.json(data, { status: data.error === "duplicate" ? 409 : 400 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Couldn't reach the allowlist sheet. Try again shortly." },
      { status: 502 }
    );
  }
}

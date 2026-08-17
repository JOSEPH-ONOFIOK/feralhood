import { NextRequest, NextResponse } from "next/server";

const WEBAPP_URL = process.env.GOOGLE_SHEETS_WEBAPP_URL;

export async function POST(req: NextRequest) {
  if (!WEBAPP_URL) {
    return NextResponse.json(
      { error: "Allowlist isn't configured yet. Set GOOGLE_SHEETS_WEBAPP_URL." },
      { status: 503 }
    );
  }

  let body: { handle?: string; wallet?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const handle = String(body.handle || "").trim();
  const wallet = String(body.wallet || "").trim();

  if (!handle || !wallet) {
    return NextResponse.json({ error: "Missing handle or wallet." }, { status: 400 });
  }

  try {
    const upstream = await fetch(WEBAPP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // `inviteCode` is a compatibility shim, not a real field: the older
      // deployed Apps Script rejects any payload missing it. The updated
      // script ignores it entirely, so this is safe either way -- drop it
      // once the new script is deployed everywhere.
      body: JSON.stringify({ handle, wallet, inviteCode: "n/a" }),
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

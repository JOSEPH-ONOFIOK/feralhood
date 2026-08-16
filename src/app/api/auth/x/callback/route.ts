import { NextRequest, NextResponse } from "next/server";
import { encodeSession } from "@/lib/xSession";

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const fail = (reason: string) =>
    NextResponse.redirect(`${origin}/?allowlist=1&xerror=${encodeURIComponent(reason)}`);

  const clientId = process.env.X_CLIENT_ID;
  const clientSecret = process.env.X_CLIENT_SECRET;
  if (!clientId || !clientSecret || !process.env.AUTH_SECRET) {
    return fail("not_configured");
  }

  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const storedState = req.cookies.get("x_oauth_state")?.value;
  const verifier = req.cookies.get("x_oauth_verifier")?.value;

  if (!code || !state || !verifier || state !== storedState) {
    return fail("invalid_state");
  }

  const redirectUri = `${origin}/api/auth/x/callback`;

  try {
    const tokenRes = await fetch("https://api.twitter.com/2/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        code_verifier: verifier,
      }),
    });

    if (!tokenRes.ok) return fail("token_exchange_failed");
    const tokenData = await tokenRes.json();

    const meRes = await fetch("https://api.twitter.com/2/users/me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    if (!meRes.ok) return fail("profile_fetch_failed");
    const meData = await meRes.json();

    const res = NextResponse.redirect(`${origin}/?allowlist=1&xconnected=1`);
    res.cookies.set("x_session", encodeSession({ id: meData.data.id, username: meData.data.username }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    res.cookies.delete("x_oauth_verifier");
    res.cookies.delete("x_oauth_state");
    return res;
  } catch {
    return fail("unexpected_error");
  }
}

import { NextRequest, NextResponse } from "next/server";
import { generateCodeChallenge, generateCodeVerifier, generateState } from "@/lib/pkce";

export async function GET(req: NextRequest) {
  const clientId = process.env.X_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { error: "X sign-in isn't configured. Set X_CLIENT_ID and X_CLIENT_SECRET." },
      { status: 503 }
    );
  }

  const verifier = generateCodeVerifier();
  const state = generateState();
  const challenge = generateCodeChallenge(verifier);
  const redirectUri = `${req.nextUrl.origin}/api/auth/x/callback`;

  const authorizeUrl = new URL("https://twitter.com/i/oauth2/authorize");
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("scope", "users.read tweet.read");
  authorizeUrl.searchParams.set("state", state);
  authorizeUrl.searchParams.set("code_challenge", challenge);
  authorizeUrl.searchParams.set("code_challenge_method", "S256");

  const res = NextResponse.redirect(authorizeUrl);
  const cookieOpts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 600,
    path: "/",
  };
  res.cookies.set("x_oauth_verifier", verifier, cookieOpts);
  res.cookies.set("x_oauth_state", state, cookieOpts);
  return res;
}

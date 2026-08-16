import { NextRequest, NextResponse } from "next/server";
import { decodeSession } from "@/lib/xSession";

export async function GET(req: NextRequest) {
  const session = decodeSession(req.cookies.get("x_session")?.value);
  if (!session) return NextResponse.json({ connected: false });
  return NextResponse.json({ connected: true, username: session.username });
}

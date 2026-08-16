import { createHmac, timingSafeEqual } from "crypto";

export type XSession = {
  id: string;
  username: string;
};

const SECRET = process.env.AUTH_SECRET || "";

function sign(value: string): string {
  return createHmac("sha256", SECRET).update(value).digest("base64url");
}

export function encodeSession(session: XSession): string {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function decodeSession(cookieValue: string | undefined): XSession | null {
  if (!cookieValue || !SECRET) return null;

  const [payload, signature] = cookieValue.split(".");
  if (!payload || !signature) return null;

  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

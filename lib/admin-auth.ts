import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "skajagbuda_admin";
const SESSION_SALT = "skajagbuda-admin-v1";

export function getAdminSecret(): string | null {
  const secret = process.env.ADMIN_ACCESS_CODE?.trim();
  return secret || null;
}

export function createAdminSessionToken(secret: string): string {
  return createHmac("sha256", secret).update(SESSION_SALT).digest("base64url");
}

export function verifyAdminSession(token: string | undefined): boolean {
  const secret = getAdminSecret();
  if (!secret || !token) return false;
  try {
    const expected = createAdminSessionToken(secret);
    if (token.length !== expected.length) return false;
    return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function verifyAccessCode(code: string): boolean {
  const secret = getAdminSecret();
  if (!secret) return false;
  try {
    if (code.length !== secret.length) return false;
    return timingSafeEqual(Buffer.from(code), Buffer.from(secret));
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifyAdminSession(cookieStore.get(ADMIN_COOKIE)?.value);
}

import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  createAdminSessionToken,
  getAdminSecret,
  verifyAccessCode,
} from "@/lib/admin-auth";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(request: Request) {
  if (!getAdminSecret()) {
    return NextResponse.json(
      { error: "Admin är inte konfigurerat. Sätt ADMIN_ACCESS_CODE i miljövariabler." },
      { status: 503 },
    );
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limit = checkRateLimit(`admin-auth:${ip}`, { limit: 5, windowSec: 300 });
  if (!limit.success) {
    return NextResponse.json({ error: "För många försök. Vänta några minuter." }, { status: 429 });
  }

  let code: string;
  try {
    const body = (await request.json()) as { code?: string };
    code = body.code?.trim() ?? "";
  } catch {
    return NextResponse.json({ error: "Ogiltig begäran." }, { status: 400 });
  }

  if (!code || !verifyAccessCode(code)) {
    return NextResponse.json({ error: "Fel kod." }, { status: 401 });
  }

  const token = createAdminSessionToken(getAdminSecret()!);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return response;
}

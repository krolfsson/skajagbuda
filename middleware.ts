import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PRODUCTION_HOST = "skajagbuda.se";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase() ?? "";

  if (host.endsWith(".vercel.app") || host === `www.${PRODUCTION_HOST}`) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.host = PRODUCTION_HOST;
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};

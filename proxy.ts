import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PRODUCTION_HOST = "skajagbuda.se";

export function proxy(request: NextRequest) {
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
  // /api is excluded: Stripe does not follow redirects, so a webhook endpoint registered on
  // a *.vercel.app host must be answered directly.
  matcher: ["/((?!api/|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};

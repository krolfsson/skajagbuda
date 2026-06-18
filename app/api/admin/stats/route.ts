import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  getAdminStats,
  parseAdminGranularity,
  parseAdminRange,
} from "@/lib/admin-stats";

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const range = parseAdminRange(searchParams.get("range"));
  const granularity = parseAdminGranularity(searchParams.get("granularity"));

  try {
    const stats = await getAdminStats(range, granularity);
    return NextResponse.json(stats);
  } catch (error) {
    console.error("[admin/stats]", error);
    return NextResponse.json({ error: "Kunde inte hämta statistik." }, { status: 500 });
  }
}

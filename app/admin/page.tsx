import type { Metadata } from "next";
import { NOINDEX_ROBOTS } from "@/lib/seo";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin",
  robots: NOINDEX_ROBOTS,
};

export default function AdminPage() {
  return <AdminDashboard />;
}

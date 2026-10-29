import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboard } from "@/pages/AdminPages";
export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin Dashboard | DriveEase" }, { name: "description", content: "Admin Dashboard - DriveEase vehicle rental." }, { property: "og:title", content: "Admin Dashboard | DriveEase" }, { property: "og:description", content: "Admin Dashboard - DriveEase vehicle rental." }] }),
  component: AdminDashboard,
});

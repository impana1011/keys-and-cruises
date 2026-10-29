import { createFileRoute } from "@tanstack/react-router";
import { AdminVehicles } from "@/pages/AdminPages";
export const Route = createFileRoute("/admin/vehicles")({
  head: () => ({ meta: [{ title: "Manage Vehicles | DriveEase" }, { name: "description", content: "Manage Vehicles - DriveEase vehicle rental." }, { property: "og:title", content: "Manage Vehicles | DriveEase" }, { property: "og:description", content: "Manage Vehicles - DriveEase vehicle rental." }] }),
  component: AdminVehicles,
});

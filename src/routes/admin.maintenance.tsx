import { createFileRoute } from "@tanstack/react-router";
import { AdminMaintenance } from "@/pages/AdminPages";

export const Route = createFileRoute("/admin/maintenance")({
  head: () => ({
    meta: [
      { title: "Fleet Maintenance & Health | DriveEase Admin" },
      { name: "description", content: "Automated maintenance tracking, PUC, and service scheduling." },
      { property: "og:title", content: "Fleet Maintenance & Health | DriveEase Admin" },
      { property: "og:description", content: "Automated maintenance tracking, PUC, and service scheduling." },
    ],
  }),
  component: AdminMaintenance,
});

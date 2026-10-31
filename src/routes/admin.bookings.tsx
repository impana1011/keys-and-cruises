import { createFileRoute } from "@tanstack/react-router";
import { AdminBookings } from "@/pages/AdminPages";
export const Route = createFileRoute("/admin/bookings")({
  head: () => ({ meta: [{ title: "Manage Bookings | DriveEase" }, { name: "description", content: "Manage Bookings - DriveEase vehicle rental." }, { property: "og:title", content: "Manage Bookings | DriveEase" }, { property: "og:description", content: "Manage Bookings - DriveEase vehicle rental." }] }),
  component: AdminBookings,
});

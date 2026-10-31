import { createFileRoute } from "@tanstack/react-router";
import { MyBookingsPage } from "@/pages/PublicPages";
export const Route = createFileRoute("/my-bookings")({
  head: () => ({ meta: [{ title: "My Bookings | DriveEase" }, { name: "description", content: "My Bookings - DriveEase vehicle rental." }, { property: "og:title", content: "My Bookings | DriveEase" }, { property: "og:description", content: "My Bookings - DriveEase vehicle rental." }] }),
  component: MyBookingsPage,
});

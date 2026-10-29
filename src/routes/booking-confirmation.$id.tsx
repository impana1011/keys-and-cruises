import { createFileRoute } from "@tanstack/react-router";
import { ConfirmationPage } from "@/pages/PublicPages";
export const Route = createFileRoute("/booking-confirmation/$id")({
  head: () => ({ meta: [{ title: "Booking Confirmation | DriveEase" }, { name: "description", content: "Booking Confirmation - DriveEase vehicle rental." }, { property: "og:title", content: "Booking Confirmation | DriveEase" }, { property: "og:description", content: "Booking Confirmation - DriveEase vehicle rental." }] }),
  component: () => <ConfirmationPage id={Route.useParams().id} />,
});

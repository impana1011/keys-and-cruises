import { createFileRoute, notFound } from "@tanstack/react-router";
import { BookingPage } from "@/pages/PublicPages";
import { vehicleService } from "@/services/api";
export const Route = createFileRoute("/booking/$vehicleId")({
  head: () => ({ meta: [{ title: "Booking | DriveEase" }, { name: "description", content: "Booking - DriveEase vehicle rental." }, { property: "og:title", content: "Booking | DriveEase" }, { property: "og:description", content: "Booking - DriveEase vehicle rental." }] }),
  validateSearch: (s: Record<string, unknown>) : { pickup?: string | undefined; ret?: string | undefined } => ({ pickup: s["pickup"] as string | undefined, ret: s["ret"] as string | undefined }),
  loader: ({ params }) => { const v = vehicleService.getById(params.vehicleId); if (!v) throw notFound(); return v; },
  component: () => { const s = Route.useSearch(); return <BookingPage v={Route.useLoaderData()} pickup={s.pickup} ret={s.ret} />; },
  notFoundComponent: () => <p className="p-8">Vehicle not found.</p>,
  errorComponent: () => <p className="p-8">Error loading booking.</p>,
});

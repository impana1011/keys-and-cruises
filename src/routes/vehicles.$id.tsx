import { createFileRoute, notFound } from "@tanstack/react-router";
import { VehicleDetailsPage } from "@/pages/PublicPages";
import { vehicleService } from "@/services/api";
export const Route = createFileRoute("/vehicles/$id")({
  head: () => ({ meta: [{ title: "Vehicle Details | DriveEase" }, { name: "description", content: "Vehicle Details - DriveEase vehicle rental." }, { property: "og:title", content: "Vehicle Details | DriveEase" }, { property: "og:description", content: "Vehicle Details - DriveEase vehicle rental." }] }),
  loader: ({ params }) => { const v = vehicleService.getById(params.id); if (!v) throw notFound(); return v; },
  component: () => <VehicleDetailsPage v={Route.useLoaderData()} />,
  notFoundComponent: () => <p className="p-8">Vehicle not found.</p>,
  errorComponent: () => <p className="p-8">Error loading vehicle.</p>,
});

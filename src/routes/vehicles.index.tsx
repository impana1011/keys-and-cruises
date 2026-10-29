import { createFileRoute } from "@tanstack/react-router";
import { VehiclesPage } from "@/pages/PublicPages";
export const Route = createFileRoute("/vehicles/")({
  head: () => ({ meta: [{ title: "Vehicles | DriveEase" }, { name: "description", content: "Vehicles - DriveEase vehicle rental." }, { property: "og:title", content: "Vehicles | DriveEase" }, { property: "og:description", content: "Vehicles - DriveEase vehicle rental." }] }),
  validateSearch: (s: Record<string, unknown>) : { q?: string; category?: string } => ({ q: s.q as string | undefined, category: s.category as string | undefined }),
  component: () => { const s = Route.useSearch(); return <VehiclesPage q={s.q} category={s.category} />; },
});

import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/pages/PublicPages";
export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "DriveEase — Rent Cars & Bikes" }, { name: "description", content: "Search and rent cars and bikes with DriveEase." }, { property: "og:title", content: "DriveEase — Rent Cars & Bikes" }, { property: "og:description", content: "Search and rent cars and bikes with DriveEase." }] }),
  component: HomePage,
});

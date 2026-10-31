import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/pages/PublicPages";
export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Register | DriveEase" }, { name: "description", content: "Register - DriveEase vehicle rental." }, { property: "og:title", content: "Register | DriveEase" }, { property: "og:description", content: "Register - DriveEase vehicle rental." }] }),
  component: () => <AuthPage mode="register" />,
});

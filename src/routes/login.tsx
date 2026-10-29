import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/pages/PublicPages";
export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login | DriveEase" }, { name: "description", content: "Login - DriveEase vehicle rental." }, { property: "og:title", content: "Login | DriveEase" }, { property: "og:description", content: "Login - DriveEase vehicle rental." }] }),
  component: () => <AuthPage mode="login" />,
});

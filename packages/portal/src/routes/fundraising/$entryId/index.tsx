import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/fundraising/$entryId/")({
  component: RouteComponent,
});

function RouteComponent() {
  return "Hello /fundraising/$entryId/!";
}

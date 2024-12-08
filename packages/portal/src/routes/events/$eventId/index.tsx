import { createFileRoute } from "@tanstack/react-router";

import { EventViewer } from "#elements/viewers/event/EventViewer.js";

export function ViewEvent() {
  const { eventId } = Route.useParams();

  return (
    <div>
      <EventViewer id={eventId} />
    </div>
  );
}

export const Route = createFileRoute("/events/$eventId/")({
  component: ViewEvent,
});

import { createFileRoute } from "@tanstack/react-router";

import { EventEditor } from "#elements/forms/event/edit/EventEditor.js";

export function EditEvent() {
  const { eventId } = Route.useParams();

  return (
    <div>
      <EventEditor id={eventId} />
    </div>
  );
}

export const Route = createFileRoute("/events/$eventId/edit")({
  component: EditEvent,
});

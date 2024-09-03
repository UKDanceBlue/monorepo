import { EventCreator } from "@elements/forms/event/create/EventCreator";
import { createFileRoute } from "@tanstack/react-router";

function EventsCreate() {
  return (
    <div>
      <h1>Create Event</h1>
      <EventCreator />
    </div>
  );
}

export const Route = createFileRoute("/events/create")({
  component: EventsCreate,
});

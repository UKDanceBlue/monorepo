import { EventViewer } from "@elements/viewers/event/EventViewer";
import { useParams } from "@tanstack/react-router";

export function ViewEventPage() {
  const { eventId } = useParams({ from: "/events/$eventId" });

  return (
    <div>
      <EventViewer uuid={eventId} />
    </div>
  );
}

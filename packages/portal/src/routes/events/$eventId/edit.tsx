import { EventEditor } from "@elements/forms/event/edit/EventEditor";
import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { graphql } from "@ukdanceblue/common/graphql-client-portal";
import { useQuery } from "urql";

const viewEventPageDocument = graphql(/* GraphQL */ `
  query EditEventPage($uuid: GlobalId!) {
    event(uuid: $uuid) {
      data {
        ...EventEditorFragment
      }
    }
  }
`);

export function EditEvent() {
  const { eventId } = useParams({ from: "/events/$eventId/edit" });

  const [{ data, fetching, error }, refetchEvent] = useQuery({
    query: viewEventPageDocument,
    variables: { uuid: eventId },
  });

  useQueryStatusWatcher({
    error,
    fetching,
    loadingMessage: "Loading event...",
  });

  return (
    <div>
      <EventEditor
        eventFragment={data?.event.data}
        refetchEvent={refetchEvent}
      />
    </div>
  );
}

export const Route = createFileRoute("/events/$eventId/edit")({
  component: EditEvent,
});

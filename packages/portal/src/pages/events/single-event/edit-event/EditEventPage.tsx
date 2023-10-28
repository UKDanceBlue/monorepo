import { EventEditor } from "@elements/forms/event/edit/EventEditor";
import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { useParams } from "@tanstack/react-router";
import { graphql } from "@ukdanceblue/common/graphql-client-admin";
import { useQuery } from "urql";

const viewEventPageDocument = graphql(/* GraphQL */ `
  query EditEventPage($uuid: String!) {
    event(uuid: $uuid) {
      data {
        ...EventEditorFragment
      }
    }
  }
`);

export function EditEventPage() {
  const { eventId } = useParams({ from: "/events/$eventId" });

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

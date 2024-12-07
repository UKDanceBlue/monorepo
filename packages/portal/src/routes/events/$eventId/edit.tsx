import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "urql";

import { EventEditor } from "#elements/forms/event/edit/EventEditor.js";
import { EventEditorFragment } from "#elements/forms/event/edit/EventEditorGQL.ts";
import { graphql } from "#graphql/index.js";
import { useQueryStatusWatcher } from "#hooks/useQueryStatusWatcher.js";

const viewEventPageDocument = graphql(
  /* GraphQL */ `
    query EditEventPage($uuid: GlobalId!) {
      event(uuid: $uuid) {
        ...EventEditorFragment
      }
    }
  `,
  [EventEditorFragment]
);

export function EditEvent() {
  const { eventId } = Route.useParams();

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
      <EventEditor eventFragment={data?.event} refetchEvent={refetchEvent} />
    </div>
  );
}

export const Route = createFileRoute("/events/$eventId/edit")({
  component: EditEvent,
  async beforeLoad({ context, params: { eventId } }) {
    await context.urqlClient.query(viewEventPageDocument, { uuid: eventId });
  },
});

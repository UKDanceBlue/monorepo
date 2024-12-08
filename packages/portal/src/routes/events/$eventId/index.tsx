import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "urql";

import {
  EventViewer,
  EventViewerFragment,
} from "#elements/viewers/event/EventViewer.js";
import { graphql } from "#graphql/index.js";
import { useQueryStatusWatcher } from "#hooks/useQueryStatusWatcher.js";

const viewEventPageDocument = graphql(
  /* GraphQL */ `
    query ViewEventPage($id: GlobalId!) {
      event(id: $id) {
        ...EventViewerFragment
      }
    }
  `,
  [EventViewerFragment]
);

export function ViewEvent() {
  const { eventId } = Route.useParams();

  const [{ data, fetching, error }] = useQuery({
    query: viewEventPageDocument,
    variables: { id: eventId },
  });

  useQueryStatusWatcher({
    error,
    fetching,
    loadingMessage: "Loading event...",
  });

  return (
    <div>
      <EventViewer id={eventId} />
    </div>
  );
}

export const Route = createFileRoute("/events/$eventId/")({
  component: ViewEvent,
  async beforeLoad({ context, params: { eventId } }) {
    await context.urqlClient.query(viewEventPageDocument, { id: eventId });
  },
});

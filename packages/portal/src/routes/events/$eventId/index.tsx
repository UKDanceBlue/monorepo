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
    query ViewEventPage($uuid: GlobalId!) {
      event(uuid: $uuid) {
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
    variables: { uuid: eventId },
  });

  useQueryStatusWatcher({
    error,
    fetching,
    loadingMessage: "Loading event...",
  });

  return (
    <div>
      <EventViewer eventFragment={data?.event} />
    </div>
  );
}

export const Route = createFileRoute("/events/$eventId/")({
  component: ViewEvent,
  async beforeLoad({ context, params: { eventId } }) {
    await context.urqlClient.query(viewEventPageDocument, { uuid: eventId });
  },
});

import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { useParams } from "@tanstack/react-router";
import { graphql } from "@ukdanceblue/common/graphql-client-admin";
import { useQuery } from "urql";

import { EventViewer } from "./EventViewer";

const viewEventPageDocument = graphql(/* GraphQL */ `
  query ViewEventPage($uuid: GlobalId!) {
    event(uuid: $uuid) {
      data {
        ...EventViewerFragment
      }
    }
  }
`);

export function ViewEventPage() {
  const { eventId } = useParams({ from: "/events/$eventId" });

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
      <EventViewer eventFragment={data?.event.data} />
    </div>
  );
}

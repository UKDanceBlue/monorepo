import { EventViewer } from "@elements/viewers/event/EventViewer";
import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { createFileRoute } from "@tanstack/react-router";
import { routerAuthCheck } from "@tools/routerAuthCheck";
import { AccessLevel } from "@ukdanceblue/common";
import { graphql } from "@ukdanceblue/common/graphql-client-portal";
import { useQuery } from "urql";

const viewEventPageDocument = graphql(/* GraphQL */ `
  query ViewEventPage($uuid: GlobalId!) {
    event(uuid: $uuid) {
      data {
        ...EventViewerFragment
      }
    }
  }
`);

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
      <EventViewer eventFragment={data?.event.data} />
    </div>
  );
}

export const Route = createFileRoute("/events/$eventId/")({
  component: ViewEvent,
  async beforeLoad({ context, params: { eventId } }) {
    await context.urqlClient.query(viewEventPageDocument, { uuid: eventId });
    routerAuthCheck(Route, context);
  },
  staticData: {
    authorizationRules: [
      {
        accessLevel: AccessLevel.CommitteeChairOrCoordinator,
      },
    ],
  },
});

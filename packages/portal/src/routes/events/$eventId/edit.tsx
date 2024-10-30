import { createFileRoute } from "@tanstack/react-router";
import { AccessLevel, CommitteeRole } from "@ukdanceblue/common";
import { useQuery } from "urql";

import { EventEditor } from "#elements/forms/event/edit/EventEditor";
import { graphql } from "#graphql/index.js";
import { useQueryStatusWatcher } from "#hooks/useQueryStatusWatcher";
import { routerAuthCheck } from "#tools/routerAuthCheck";

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
      <EventEditor
        eventFragment={data?.event.data}
        refetchEvent={refetchEvent}
      />
    </div>
  );
}

export const Route = createFileRoute("/events/$eventId/edit")({
  component: EditEvent,
  async beforeLoad({ context, params: { eventId } }) {
    await context.urqlClient.query(viewEventPageDocument, { uuid: eventId });
    routerAuthCheck(Route, context);
  },
  staticData: {
    authorizationRules: [
      {
        accessLevel: AccessLevel.Admin,
      },
      {
        minCommitteeRole: CommitteeRole.Chair,
      },
    ],
  },
});

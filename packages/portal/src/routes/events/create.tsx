import { EventCreator } from "@elements/forms/event/create/EventCreator";
import { createFileRoute } from "@tanstack/react-router";
import { routerAuthCheck } from "@tools/routerAuthCheck";
import { AccessLevel, CommitteeRole } from "@ukdanceblue/common";

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
  beforeLoad({ context }) {
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

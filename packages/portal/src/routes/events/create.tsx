console.log("Events on calendar. ");
import { EventCreator } from "@elements/forms/event/create/EventCreator";
import { createFileRoute } from "@tanstack/react-router";
import { AccessLevel, CommitteeRole } from "@ukdanceblue/common";

import { EventCreator } from "#elements/forms/event/create/EventCreator.js";
import { routerAuthCheck } from "#tools/routerAuthCheck.js";

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

import { createFileRoute } from "@tanstack/react-router";
import { AccessLevel, CommitteeRole } from "@ukdanceblue/common";

import { EventCreator } from "#elements/forms/event/create/EventCreator.js";

function EventsCreate() {
  return (
    <div>
      <h1>Create Event</h1>
      <p>Add an event to the DanceBlue app and website.</p>
      <EventCreator />
    </div>
  );
}

export const Route = createFileRoute("/events/create")({
  component: EventsCreate,

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

import { List } from "@refinedev/antd";
import { createFileRoute } from "@tanstack/react-router";

import { EventsTable } from "#elements/tables/EventsTable.js";

function Events() {
  return (
    <List>
      <EventsTable />
    </List>
  );
}

export const Route = createFileRoute("/events/")({
  component: Events,
});

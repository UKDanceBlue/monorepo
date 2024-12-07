import { PlusOutlined } from "@ant-design/icons";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button, Flex, Typography } from "antd";

import { EventsTable } from "#elements/tables/EventsTable.js";

function Events() {
  return (
    <>
      <Flex justify="space-between" align="center">
        <Typography.Title>Events</Typography.Title>
        <Link from="/events" to="create">
          <Button icon={<PlusOutlined />} size="large">
            Add Event
          </Button>
        </Link>
      </Flex>
      <EventsTable />
    </>
  );
}

export const Route = createFileRoute("/events/")({
  component: Events,
});

import { PlusOutlined } from "@ant-design/icons";
import { EventsTable } from "@elements/tables/EventsTable";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button, Flex, Typography } from "antd";

function Events() {
  const navigate = useNavigate();
  return (
    <>
      <Flex justify="space-between" align="center">
        <Typography.Title>Events</Typography.Title>
        <Button
          type="link"
          icon={<PlusOutlined />}
          onClick={() => void navigate({ to: "/events/create" })}
          size="large"
        >
          Add Event
        </Button>
      </Flex>
      <EventsTable />
    </>
  );
}

export const Route = createFileRoute("/events/")({
  component: Events,
});

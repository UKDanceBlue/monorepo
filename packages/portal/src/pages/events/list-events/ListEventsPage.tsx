import { PlusOutlined } from "@ant-design/icons";
import { EventsTable } from "@elements/tables/EventsTable";
import { useNavigate } from "@tanstack/react-router";
import { Button, Flex, Typography } from "antd";

export function ListEvensPage() {
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

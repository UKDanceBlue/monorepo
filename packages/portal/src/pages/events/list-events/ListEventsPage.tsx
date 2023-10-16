import { EventsTable } from "@elements/tables/EventsTable";
import { Typography } from "antd";

export function ListEvensPage() {
  return (
    <>
      <Typography.Title>Events</Typography.Title>
      <EventsTable />
    </>
  );
}

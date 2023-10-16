import { Outlet } from "@tanstack/react-router";
import { Typography } from "antd";

export function EventsPage() {
  return (
    <>
      <Typography.Title>Events</Typography.Title>
      <Outlet />
    </>
  );
}

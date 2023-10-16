import { Outlet } from "@tanstack/react-router";

export function SingleEventPage() {
  return (
    <div>
      <h1>Single Event</h1>
      <Outlet />
    </div>
  );
}

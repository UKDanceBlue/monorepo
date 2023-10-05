import type { EventResource } from "@ukdanceblue/common";
import { ApiClient } from "@ukdanceblue/common";
import { DateTime, Interval } from "luxon";

import EventView from "./EventView";

import dbApiClient from "@/lib/apiClient";

async function getData() {
  let error: Error | null = null;
  let events: EventResource[] = [];

  try {
    const res = await dbApiClient.eventApi.getEvents();
    events = res.resource.resources ?? [];
  } catch (error_) {
    error = error_ instanceof Error ? error_ : new Error("Unknown error");
  }

  return {
    events,
    error,
  };
}

export default async function EventList() {
  const data = await getData();

  if (data.error) {
    return <div>Error: {data.error.message}</div>;
  } else {
    return (
      <div>
        <h1>Events</h1>
        {data.events.map((e) => {
          return <EventView key={e.eventId} e={e} showLink />;
        })}
      </div>
    );
  }
}

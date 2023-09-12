import EventView from "@/components/EventView";
import dbApiClient from "@/lib/apiClient";
import { ApiClient, EventResource } from "@ukdanceblue/db-app-common";

async function getData(eventId: string): Promise<
  | {
      event: EventResource;
      error: Error | null;
    }
  | {
      event: undefined;
      error: Error;
    }
> {
  let error: Error | null = null;

  let event: EventResource | undefined = undefined;
  try {
    const res = await dbApiClient.eventApi.getEvent(eventId);
    const resource = res.resource.resource;
    event = resource;
  } catch (e) {
    if (e instanceof Error) error = e;
    else error = new Error("Unknown error");
  }

  if (!event) {
    return {
      event: undefined,
      error: error ?? new Error("Unknown error"),
    };
  } else {
    return {
      event,
      error,
    };
  }
}

export default async function EventPage({
  params,
}: {
  params: {
    eventId: string;
  };
}) {
  const data = await getData(params.eventId);

  return (
    <main className="flex min-h-screen flex-col p-24">
      {data.error ? <div>Error: {data.error.message}</div> : null}
      {data.event ? <EventView e={data.event} showDetails /> : null}
    </main>
  );
}

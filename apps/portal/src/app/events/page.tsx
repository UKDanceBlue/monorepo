import CreateEvent from "@/components/CreateEvent";
import EventList from "@/components/EventList";
import Image from "next/image";
export default function EventsPage() {
  return (
    <main className="flex min-h-screen flex-col p-24">
      <p>Events List</p>
      {/* @ts-expect-error Async Server Component */}
      <EventList />
      <CreateEvent />
    </main>
  );
}

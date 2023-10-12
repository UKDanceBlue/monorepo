import { EventsTable } from "./elements/tables/EventsTable";
import { EventViewer } from "./elements/viewers/EventViewer";

function App() {
  return (
    <>
      <h1>Events</h1>
      <EventsTable />
      <EventViewer uuid="fdab0f22-e51f-418b-bfec-97a640db38b0" />
    </>
  );
}

export default App;

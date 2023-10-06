import { useQuery } from "@apollo/client";
import { graphql } from "@ukdanceblue/common/graphql-client-admin";
import { useState } from "react";

import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  const eventTitles = useQuery(
    graphql(/* GraphQL */ `
      query ListEvents($page: Int!) {
        listEvents(page: $page) {
          ok
          data {
            eventId
            title
            description
            duration
            occurrences
            summary
            images {
              url
              width
              height
              imageId
            }
          }
        }
      }
    `),
    {
      variables: {
        page: 1,
      },
      notifyOnNetworkStatusChange: true,
    }
  );

  console.log(eventTitles);

  return (
    <>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <div>
        <h2>Events</h2>
        {eventTitles.data?.listEvents.data.map((event) => (
          <div>Event: {event.title}</div>
        )) ?? JSON.stringify(eventTitles.error)}
      </div>
    </>
  );
}

export default App;

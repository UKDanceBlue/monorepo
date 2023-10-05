import type { EventResource } from "@ukdanceblue/common";
import { DateTime, Interval } from "luxon";

export default function EventView({
  e,
  showLink,
  showDetails,
}: {
  e: EventResource;
  showLink?: boolean;
  showDetails?: boolean;
}) {
  const intervals = e.occurrences.map((o) => {
    return e.duration ? o.until(o.plus(e.duration)) : o;
  });

  return (
    <div className="border border-gray-500 p-4 my-4 rounded-md">
      <h2>{e.title}</h2>
      <p>{e.summary}</p>
      {showDetails ? (
        <>
          <h3>Description</h3>
          <p>{e.description}</p>
          <h3>Location</h3>
          <p>{e.location}</p>
          <h3>Occurrences</h3>
          <ul>
            {intervals.map((i) => {
              if (Interval.isInterval(i)) {
                return (
                  <li key={i.toISO()}>
                    {i.toLocaleString(DateTime.DATETIME_SHORT)}
                  </li>
                );
              } else {
                return (
                  <li key={i.toISO()}>
                    {i.toLocaleString(DateTime.DATETIME_SHORT)}
                  </li>
                );
              }
            })}
          </ul>
        </>
      ) : null}
      {showLink ? <a href={`/events/${e.eventId}`}>View</a> : null}
    </div>
  );
}

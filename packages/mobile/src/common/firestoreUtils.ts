import { BasicTimestamp } from "@ukdanceblue/db-app-common/dist/shims/Firestore";
import { DateTime, Interval } from "luxon";

export function firestoreIntervalToLuxon(interval: {
  start: BasicTimestamp;
  end: BasicTimestamp;
}): Interval {
  return Interval.fromDateTimes(
    DateTime.fromJSDate(interval.start.toDate()),
    DateTime.fromJSDate(interval.end.toDate())
  );
}

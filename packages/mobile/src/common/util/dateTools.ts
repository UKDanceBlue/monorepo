import firestore, { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { DateTime, Interval } from "luxon";

export function timestampToDateTime(timestamp: FirebaseFirestoreTypes.Timestamp): DateTime {
  return DateTime.fromMillis(timestamp.toMillis());
}

export function dateTimeToTimestamp(dateTime: DateTime): FirebaseFirestoreTypes.Timestamp {
  return firestore.Timestamp.fromMillis(dateTime.toMillis());
}

export function timestampsToInterval({
  start,
  end,
}: {
  start: FirebaseFirestoreTypes.Timestamp;
  end: FirebaseFirestoreTypes.Timestamp;
}): { start: DateTime; end: DateTime } {
  return Interval.fromDateTimes(timestampToDateTime(start), timestampToDateTime(end));
}

export function intervalToTimestamps(interval: Interval): { start: FirebaseFirestoreTypes.Timestamp; end: FirebaseFirestoreTypes.Timestamp } {
  return {
    start: dateTimeToTimestamp(interval.start),
    end: dateTimeToTimestamp(interval.end),
  };
}

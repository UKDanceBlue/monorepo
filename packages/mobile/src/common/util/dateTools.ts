import type { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import firestore from "@react-native-firebase/firestore";
import { DateTime, Interval } from "luxon";

/** @deprecated */
export function timestampToDateTime(
  timestamp: FirebaseFirestoreTypes.Timestamp
): DateTime {
  return DateTime.fromMillis(timestamp.toMillis());
}

/** @deprecated */
export function dateTimeToTimestamp(
  dateTime: DateTime
): FirebaseFirestoreTypes.Timestamp {
  return firestore.Timestamp.fromMillis(dateTime.toMillis());
}

/** @deprecated */
export function timestampsToInterval({
  start,
  end,
}: {
  start: FirebaseFirestoreTypes.Timestamp;
  end: FirebaseFirestoreTypes.Timestamp;
}): { start: DateTime; end: DateTime } {
  return Interval.fromDateTimes(
    timestampToDateTime(start),
    timestampToDateTime(end)
  );
}

/** @deprecated */
export function intervalToTimestamps(interval: Interval): {
  start: FirebaseFirestoreTypes.Timestamp;
  end: FirebaseFirestoreTypes.Timestamp;
} {
  return {
    start: dateTimeToTimestamp(interval.start),
    end: dateTimeToTimestamp(interval.end),
  };
}

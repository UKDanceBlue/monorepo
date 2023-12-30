import { DateTime, Interval } from "luxon";

/** @deprecated */
export const marathonInterval = Interval.fromDateTimes(
  DateTime.fromObject({ year: 2023, month: 3, day: 25, hour: 20 }),
  DateTime.fromObject({ year: 2023, month: 3, day: 26, hour: 20 })
);

/** @deprecated */
export const marathonHourIntervals = marathonInterval.divideEqually(24);

/** @deprecated */
export const lookupHourByTime = (time: DateTime): number | null => {
  if (!marathonInterval.contains(time)) {
    return null;
  }
  const num = marathonHourIntervals.findIndex((interval) =>
    interval.contains(time)
  );
  return num === -1 ? null : num + 1;
};

/** @deprecated */
export const lookupHourIntervalByTime = (time: DateTime): Interval | null => {
  if (!marathonInterval.contains(time)) {
    return null;
  }
  const interval = marathonHourIntervals.find((interval) =>
    interval.contains(time)
  );
  return interval ?? null;
};

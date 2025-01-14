import { DateTime, Duration, Interval } from "luxon";
import SuperJSON, { registerCustom } from "superjson";

export const transformer = new SuperJSON();
registerCustom<DateTime, string>(
  {
    isApplicable(v) {
      return DateTime.isDateTime(v);
    },
    serialize(v: DateTime) {
      if (v.isValid) {
        return (v as DateTime<true>).toISO();
      }
      throw new Error("Invalid DateTime");
    },
    deserialize(v: string) {
      return DateTime.fromISO(v);
    },
  },
  "DateTime"
);
registerCustom<Duration, string>(
  {
    isApplicable(v) {
      return Duration.isDuration(v);
    },
    serialize(v: Duration) {
      if (v.isValid) {
        return (v as Duration<true>).toISO();
      }
      throw new Error("Invalid Duration");
    },
    deserialize(v: string) {
      return Duration.fromISO(v);
    },
  },
  "Duration"
);
registerCustom<Interval, string>(
  {
    isApplicable(v) {
      return Interval.isInterval(v);
    },
    serialize(v: Interval) {
      if (v.isValid) {
        return (v as Interval<true>).toISO();
      }
      throw new Error("Invalid Interval");
    },
    deserialize(v: string) {
      return Interval.fromISO(v);
    },
  },
  "Interval"
);

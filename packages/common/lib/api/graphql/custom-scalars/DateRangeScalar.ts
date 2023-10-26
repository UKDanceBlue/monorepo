import { GraphQLScalarType, Kind } from "graphql";
import { DateTime, Duration, Interval } from "luxon";

import { LuxonError } from "../../../index.js";

export const DateRangeScalar = new GraphQLScalarType<Interval, string>({
  name: "LuxonDateRange",
  description: "Date range custom scalar type (just an ISO 8601 interval)",
  parseValue(value): Interval {
    if (value == null) {
      throw new TypeError("DateRangeScalar cannot parse nullish values");
    }
    if (typeof value === "string") {
      const interval = Interval.fromISO(value);
      if (!interval.isValid) {
        throw new LuxonError(interval);
      }
      return interval;
    }
    if (Interval.isInterval(value)) {
      return value;
    }
    if (Array.isArray(value) && value.length === 2) {
      if (DateTime.isDateTime(value[0])) {
        if (DateTime.isDateTime(value[1])) {
          return Interval.fromDateTimes(value[0], value[1]);
        }
        if (Duration.isDuration(value[1])) {
          return Interval.after(value[0], value[1]);
        }
      }
      if (value[0] instanceof Date && value[1] instanceof Date) {
        if (
          value[0].toString() === "Invalid Date" ||
          value[1].toString() === "Invalid Date"
        ) {
          throw new TypeError(
            "DateRangeScalar cannot parse tuples of [Date, Date] with invalid dates"
          );
        }
        return Interval.fromDateTimes(
          DateTime.fromJSDate(value[0]),
          DateTime.fromJSDate(value[1])
        );
      }
      throw new TypeError(
        "DateRangeScalar can only parse tuples of [DateTime, DateTime], [Date, Date] or [DateTime, Duration]"
      );
    }
    throw new TypeError(
      "DateRangeScalar can only parse strings, Luxon intervals, or tuples of [DateTime, DateTime], [Date, Date] or [DateTime, Duration]"
    );
  },
  parseLiteral(ast): Interval {
    if (ast.kind === Kind.STRING) {
      const interval = Interval.fromISO(ast.value);
      if (!interval.isValid) {
        throw new LuxonError(interval);
      }
      return interval;
    }
    throw new TypeError("DateRangeScalar can only parse literal string values");
  },
  specifiedByURL: "https://www.iso.org/iso-8601-date-and-time-format.html",
  serialize(value): string {
    if (Interval.isInterval(value) && value.isValid) {
      return value.toISO()!;
    } else if (typeof value === "string") {
      const interval = Interval.fromISO(value);
      if (interval.isValid) {
        return interval.toISO()!;
      } else {
        throw new TypeError(
          "DateRangeScalar can only serialize strings that are valid ISO 8601 intervals",
          {
            cause: new LuxonError(interval),
          }
        );
      }
    }
    throw new TypeError(
      "DateRangeScalar can only serialize Luxon Interval objects"
    );
  },
});

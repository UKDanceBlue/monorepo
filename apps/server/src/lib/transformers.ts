import { DateTime, Interval } from "luxon";
import {
  Range,
  parse as parseRange,
  serialize as serializeRange,
} from "postgres-range";

import { LuxonError } from "./CustomErrors.js";

export const luxonDateTimeJsDateTransformer = {
  from: (value: Date): DateTime => {
    return DateTime.fromJSDate(value, { zone: "utc" });
  },
  to: (
    value?: DateTime | null | undefined | Record<string, never>
  ): Date | undefined => {
    if (!value) return undefined;
    if (!DateTime.isDateTime(value)) throw new Error("Not a DateTime");
    return value.toJSDate();
  },
};

export const luxonDateTimeJsDateArrayTransformer = {
  from: (value: Date[]): DateTime[] => {
    return value.map((date) => DateTime.fromJSDate(date, { zone: "utc" }));
  },
  to: (value?: DateTime[] | null | undefined | Record<string, never>) => {
    if (!value) return undefined;
    if (!Array.isArray(value)) throw new Error("Not an array");
    return value.map((dateTime) => {
      if (!DateTime.isDateTime(dateTime)) throw new Error("Not a DateTime");
      return dateTime.toJSDate();
    });
  },
};

export const luxonIntervalPgRangeTransformer = {
  from: (value: string) => {
    const range = parseRange(value, (value) => DateTime.fromISO(value));
    if (range.lower == null || range.upper == null)
      throw new Error("Not a range");
    return Interval.fromDateTimes(range.lower, range.upper);
  },
  to: (value?: Interval | null | undefined | Record<string, never>) => {
    if (value == null) return null;
    if (!Interval.isInterval(value) || value.start == null || value.end == null)
      throw new Error("Not an Interval");
    if (!value.isValid) throw new LuxonError(value);
    const range = new Range<DateTime>(value.start, value.end, 0);
    return serializeRange<DateTime>(range, (dateTime) => {
      const iso = dateTime.toISO();
      if (iso == null) {
        const error = dateTime.isValid
          ? new Error("Not an ISO string")
          : new LuxonError(dateTime);
        throw error;
      }
      return iso;
    });
  },
};

export const luxonDateISOStringTransformer = {
  from: (value: string) => {
    return DateTime.fromISO(value, { zone: "utc" });
  },
  to: (value?: DateTime | null | undefined | Record<string, never>) => {
    return value?.toISODate?.();
  },
};

export const luxonTimeISOStringTransformer = {
  from: (value: string) => {
    return DateTime.fromISO(value, { zone: "utc" });
  },
  to: (value?: DateTime | null | undefined | Record<string, never>) => {
    return value?.toISOTime?.();
  },
};

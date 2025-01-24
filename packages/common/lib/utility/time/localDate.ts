import { DateTime, Interval } from "luxon";
import type { Result } from "ts-results-es";

import { LuxonError } from "../../error/index.js";

export type LocalDate = `${number}-${number}-${number}`;

export function localDate(
  year: number,
  month: number,
  day: number
): Result<LocalDate, LuxonError> {
  return LuxonError.luxonObjectToResult(
    DateTime.fromObject({ year, month, day })
  ).map(localDateFromLuxon);
}

export function localDateFromJs(date: Date): Result<LocalDate, LuxonError> {
  return LuxonError.luxonObjectToResult(DateTime.fromJSDate(date)).map(
    localDateFromLuxon
  );
}

export function localDateFromLuxon(date: DateTime<true>): LocalDate {
  return date.toFormat("yyyy-MM-dd") as LocalDate;
}

export function localDateToJs(date: LocalDate): Date {
  return DateTime.fromFormat(date, "yyyy-MM-dd", {
    zone: "America/New_York",
  }).toJSDate();
}

export function localDateToLuxon(
  date: LocalDate
): Result<DateTime, LuxonError> {
  return LuxonError.luxonObjectToResult(
    DateTime.fromFormat(date, "yyyy-MM-dd", {
      zone: "America/New_York",
    })
  );
}

// TODO: move
export function getFiscalYear(date: DateTime): Interval {
  const year = date.month >= 7 ? date.year : date.year - 1;
  return Interval.fromDateTimes(
    DateTime.fromObject({ month: 7, day: 1, year }).startOf("day"),
    DateTime.fromObject({ month: 6, day: 30, year: year + 1 }).endOf("day")
  );
}

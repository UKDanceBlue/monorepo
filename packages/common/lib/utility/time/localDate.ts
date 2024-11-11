import { DateTime } from "luxon";
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
  return DateTime.fromFormat(date, "yyyy-MM-dd").toJSDate();
}

export function localDateToLuxon(
  date: LocalDate
): Result<DateTime, LuxonError> {
  return LuxonError.luxonObjectToResult(
    DateTime.fromFormat(date, "yyyy-MM-dd")
  );
}

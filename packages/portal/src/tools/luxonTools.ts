import { DateTime } from "luxon";

export function renderDateTime(
  dateTime: string | Date | null | undefined,
  formatOpts?: Intl.DateTimeFormatOptions
) {
  if (!dateTime) {
    return "Never";
  }

  return typeof dateTime === "string"
    ? DateTime.fromISO(dateTime).toLocaleString(formatOpts)
    : DateTime.fromJSDate(dateTime).toLocaleString(formatOpts);
}

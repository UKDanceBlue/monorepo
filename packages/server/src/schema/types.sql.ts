import { FormattedConcreteError, LuxonError } from "@ukdanceblue/common/error";
import { customType } from "drizzle-orm/pg-core";
import { DateTime } from "luxon";

export const citext = customType<{ data: string }>({
  dataType() {
    return "citext";
  },
});
export const bytea = customType<{ data: Buffer }>({
  dataType() {
    return "bytea";
  },
});
export const timestamp = customType<{
  data: DateTime<true>;
  driverData: string;
  config: { withTimezone: boolean; precision?: number };
}>({
  dataType(config) {
    const precision =
      config?.precision !== undefined ? ` (${config.precision})` : "";
    return `timestamp${precision}${config?.withTimezone ? " with time zone" : ""}`;
  },
  fromDriver(value: string): DateTime {
    return DateTime.fromSQL(value, { zone: "utc" });
  },
  toDriver(value: DateTime<true> | Date | string): string {
    if (typeof value === "string") {
      return value;
    } else if (value instanceof Date) {
      const parsed = DateTime.fromJSDate(value);
      if (!parsed.isValid) {
        throw new FormattedConcreteError(
          LuxonError.luxonObjectToResult(parsed)
        );
      }
      return parsed.toSQL();
    } else {
      return value.toSQL();
    }
  },
});

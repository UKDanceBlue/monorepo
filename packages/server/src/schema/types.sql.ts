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
  toDriver(value: DateTime<true>): string {
    return value.toSQL();
  },
});

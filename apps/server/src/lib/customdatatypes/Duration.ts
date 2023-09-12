import { DataTypes } from "@sequelize/core";
import type { DurationLikeObject } from "luxon";
import { Duration } from "luxon";

export class DurationDataType extends DataTypes.ABSTRACT<Duration> {
  toSql() {
    return "interval";
  }

  validate(value: unknown): value is Duration {
    return value instanceof Duration;
  }

  areValuesEqual(
    value: Duration | null | undefined,
    originalValue: Duration | null | undefined
  ): boolean {
    return value == null || originalValue == null
      ? value === originalValue
      : value.equals(originalValue);
  }

  escape(value: Duration): string {
    const stringified = value.toISO();
    if (stringified == null) {
      throw new Error("Could not serialize Duration to ISO string");
    }
    return stringified;
  }

  toBindableValue(value: Duration): string {
    return this.escape(value);
  }

  parseDatabaseValue(value: unknown): unknown {
    try {
      if (typeof value === "string") {
        return Duration.fromISO(value);
      }
      if (typeof value === "number") {
        return Duration.fromMillis(value);
      }
      if (typeof value === "object") {
        return Duration.fromObject(value as DurationLikeObject);
      }
      throw new Error("Could not parse Duration from database value");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      throw new Error(
        `Could not parse Duration from database value: ${message}`
      );
    }
  }
}

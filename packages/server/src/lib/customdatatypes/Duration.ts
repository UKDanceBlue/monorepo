import { DataTypes } from "@sequelize/core";
import { LuxonError } from "@ukdanceblue/common";
import type { DurationLikeObject } from "luxon";
import { Duration } from "luxon";

import { sequelizeDb } from "../../data-source.js";
type AcceptedTypes = Duration | DurationLikeObject | string | number;

export class DurationDataType extends DataTypes.ABSTRACT<Duration> {
  toSql() {
    return "interval";
  }

  validate(value: unknown): value is AcceptedTypes {
    return (
      typeof value === "string" ||
      typeof value === "number" ||
      Duration.isDuration(value)
    );
  }

  areValuesEqual(
    value: AcceptedTypes | null | undefined,
    originalValue: AcceptedTypes | null | undefined
  ): boolean {
    if (value == null) {
      return originalValue == null;
    } else if (originalValue == null) {
      return false;
    } else {
      return this.parseDatabaseValue(value).equals(
        this.parseDatabaseValue(originalValue)
      );
    }
  }

  escape(value: AcceptedTypes): string {
    if (typeof value === "string") {
      return sequelizeDb.escape(value);
    } else if (typeof value === "number") {
      const duration = Duration.fromMillis(value);
      if (!duration.isValid) {
        throw new LuxonError(duration);
      } else {
        // Null assertion is safe because we just checked for validity
        return sequelizeDb.escape(duration.toISO()!);
      }
    } else if (Duration.isDuration(value)) {
      if (!value.isValid) {
        throw new LuxonError(value);
      } else {
        // Null assertion is safe because we just checked for validity
        return sequelizeDb.escape(value.toISO()!);
      }
    } else {
      const duration = Duration.fromDurationLike(value);
      if (!duration.isValid) {
        throw new LuxonError(duration);
      } else {
        // Null assertion is safe because we just checked for validity
        return sequelizeDb.escape(duration.toISO()!);
      }
    }
  }

  toBindableValue(value: AcceptedTypes): string {
    return this.escape(value);
  }

  parseDatabaseValue(value: unknown): Duration {
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

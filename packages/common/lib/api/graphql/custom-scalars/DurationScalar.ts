import { GraphQLScalarType, Kind } from "graphql";
import { Duration } from "luxon";

export const DurationScalar = new GraphQLScalarType({
  name: "Duration",
  description: "Luxon Duration custom scalar type",
  parseValue(value): Duration {
    if (typeof value === "string") {
      return Duration.fromISO(value);
    } else if (Duration.isDuration(value)) {
      return value;
    } else if (typeof value === "number") {
      return Duration.fromMillis(value);
    } else if (value && typeof value === "object") {
      const durationFromObject = Duration.fromObject(value);
      if (durationFromObject.isValid) {
        return durationFromObject;
      } else {
        throw new TypeError(
          "DurationScalar can only parse objects that are valid Luxon Duration objects"
        );
      }
    } else {
      throw new TypeError(
        "DurationScalar can only parse strings, numbers, or Luxon Duration objects"
      );
    }
  },
  serialize(value): string {
    if (typeof value === "string") {
      const duration = Duration.fromISO(value);
      if (duration.isValid) {
        return duration.toISO()!;
      } else {
        throw new TypeError(
          "DurationScalar can only serialize strings that are valid ISO 8601 durations"
        );
      }
    } else if (Duration.isDuration(value) && value.isValid) {
      return value.toISO()!;
    } else {
      throw new TypeError(
        "DurationScalar can only serialize strings or Luxon Duration objects"
      );
    }
  },
  parseLiteral(ast): Duration {
    if (ast.kind === Kind.STRING) {
      return Duration.fromISO(ast.value);
    } else {
      throw new TypeError(
        "DurationScalar can only parse literal string values"
      );
    }
  },
});

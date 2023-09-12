import { GraphQLScalarType, Kind } from "graphql";
import { Interval } from "luxon";

export const IntervalScalar = new GraphQLScalarType({
  name: "Interval",
  description: "Luxon Interval custom scalar type",
  parseValue(value): Interval {
    if (typeof value === "string") {
      return Interval.fromISO(value);
    } else if (Interval.isInterval(value)) {
      return value;
    } else {
      throw new TypeError("IntervalScalar can only parse strings or Luxon Interval objects");
    }
  },
  serialize(value): string {
    if (typeof value === "string") {
      const interval = Interval.fromISO(value);
      if (interval.isValid) {
        return interval.toISO()!;
      } else {
        throw new TypeError("IntervalScalar can only serialize strings that are valid ISO 8601 intervals");
      }
    } else if (Interval.isInterval(value) && value.isValid) {
      return value.toISO()!;
    } else {
      throw new TypeError("IntervalScalar can only serialize strings or Luxon Interval objects");
    }
  },
  parseLiteral(ast): Interval {
    if (ast.kind === Kind.STRING) {
      return Interval.fromISO(ast.value);
    } else {
      throw new TypeError("IntervalScalar can only parse literal string values");
    }
  }
});

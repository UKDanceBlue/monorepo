import { GraphQLScalarType, Kind } from "graphql";
import { DateTime } from "luxon";

export const DateTimeScalar = new GraphQLScalarType({
  name: "DateTime",
  description: "Luxon DateTime custom scalar type",
  parseValue(value): DateTime {
    if (typeof value === "string") {
      return DateTime.fromISO(value);
    } else if (DateTime.isDateTime(value)) {
      return value;
    } else if (typeof value === "number") {
      return DateTime.fromMillis(value);
    } else if (value instanceof Date) {
      return DateTime.fromJSDate(value);
    } else if (value && typeof value === "object") {
      const dateTimeFromObject = DateTime.fromObject(value);
      if (dateTimeFromObject.isValid) {
        return dateTimeFromObject;
      } else {
        throw new TypeError(
          "DateTimeScalar can only parse objects that are valid Luxon DateTime objects"
        );
      }
    } else {
      throw new TypeError(
        "DateTimeScalar can only parse strings, numbers, Date objects, or Luxon DateTime objects"
      );
    }
  },
  serialize(value): string {
    if (typeof value === "string") {
      const dateTime = DateTime.fromISO(value);
      if (dateTime.isValid) {
        return dateTime.toISO()!;
      } else {
        throw new TypeError(
          "DateTimeScalar can only serialize strings that are valid ISO 8601 dates"
        );
      }
    } else if (DateTime.isDateTime(value) && value.isValid) {
      return value.toISO()!;
    } else {
      throw new TypeError(
        "DateTimeScalar can only serialize strings or Luxon DateTime objects"
      );
    }
  },
  parseLiteral(ast): DateTime {
    if (ast.kind === Kind.STRING) {
      return DateTime.fromISO(ast.value);
    } else {
      throw new TypeError(
        "DateTimeScalar can only parse literal string values"
      );
    }
  },
});

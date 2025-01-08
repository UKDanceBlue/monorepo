import { GraphQLScalarType, Kind } from "graphql";
import { DateTime } from "luxon";

export const DateTimeScalar = new GraphQLScalarType<DateTime<true>, string>({
  name: "LuxonDateTime",
  specifiedByURL: "https://datatracker.ietf.org/doc/html/rfc3339",
  description: "Cursor custom scalar type",
  parseValue(value): DateTime<true> {
    if (typeof value === "string") {
      const parsed = DateTime.fromISO(value);
      if (parsed.isValid) {
        return parsed;
      } else {
        throw new TypeError("DateTimeISO can only parse valid ISO strings");
      }
    } else {
      throw new TypeError("CursorScalar can only parse strings");
    }
  },
  serialize(value): string {
    if (typeof value === "string") {
      return value;
    } else if (DateTime.isDateTime(value)) {
      const iso = value.toISO();
      if (iso === null) {
        throw new TypeError(
          "DateTimeISO can only serialize valid DateTime objects"
        );
      }
      return iso;
    } else {
      throw new TypeError("CursorScalar can only serialize strings");
    }
  },
  parseLiteral(ast): DateTime<true> {
    if (ast.kind === Kind.STRING) {
      const parsed = DateTime.fromISO(ast.value);
      if (parsed.isValid) {
        return parsed;
      } else {
        throw new TypeError("DateTimeISO can only parse valid ISO strings");
      }
    } else {
      throw new TypeError("CursorScalar can only parse literal string values");
    }
  },
});

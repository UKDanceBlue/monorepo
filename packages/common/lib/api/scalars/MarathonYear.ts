import { GraphQLScalarType, Kind } from "graphql";

import type { MarathonYearString } from "../../utility/primitive/SimpleTypes.js";

const marathonYearRegex = /^DB\d{2}$/;
function isMarathonYearString(value: string): value is MarathonYearString {
  return marathonYearRegex.test(value);
}

export const MarathonYearScalar = new GraphQLScalarType({
  name: "MarathonYear",
  description: "MarathonYear custom scalar type",
  extensions: {},
  parseValue(value): MarathonYearString {
    if (typeof value === "string") {
      if (!isMarathonYearString(value)) {
        throw new TypeError(
          "MarathonYearScalar can only parse strings that match the pattern DB00"
        );
      }
      return value;
    } else {
      throw new TypeError("MarathonYearScalar can only parse strings");
    }
  },
  serialize(value): string {
    if (typeof value === "string") {
      if (!isMarathonYearString(value)) {
        throw new TypeError(
          "MarathonYearScalar can only serialize strings that match the pattern"
        );
      }
      return value;
    } else {
      throw new TypeError("MarathonYearScalar can only serialize strings");
    }
  },
  parseLiteral(ast): MarathonYearString {
    if (ast.kind === Kind.STRING) {
      if (!isMarathonYearString(ast.value)) {
        throw new TypeError(
          "MarathonYearScalar can only parse literal string values that match the pattern"
        );
      }
      return ast.value;
    } else {
      throw new TypeError(
        "MarathonYearScalar can only parse literal string values"
      );
    }
  },
});

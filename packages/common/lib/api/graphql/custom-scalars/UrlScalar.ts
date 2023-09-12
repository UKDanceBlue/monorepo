import { GraphQLScalarType, Kind } from "graphql";

export const UrlScalar = new GraphQLScalarType({
  name: "URL",
  description: "URL custom scalar type",
  parseValue(value): URL {
    if (typeof value === "string") {
      return new URL(value);
    } else if (value instanceof URL) {
      return value;
    } else {
      throw new TypeError("URLScalar can only parse strings or URL objects");
    }
  },
  serialize(value): string {
    if (typeof value === "string") {
      return value;
    } else if (value instanceof URL) {
      return value.toString();
    } else {
      throw new TypeError("URLScalar can only serialize strings or URL objects");
    }
  },
  parseLiteral(ast): URL {
    if (ast.kind === Kind.STRING) {
      return new URL(ast.value);
    } else {
      throw new TypeError("URLScalar can only parse literal string values");
    }
  }
})

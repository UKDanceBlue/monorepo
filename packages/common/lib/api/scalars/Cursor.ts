import { GraphQLScalarType, Kind } from "graphql";

export const CursorScalar = new GraphQLScalarType({
  name: "Cursor",
  description: "Cursor custom scalar type",
  parseValue(value): string {
    if (typeof value === "string") {
      return value;
    } else {
      throw new TypeError("CursorScalar can only parse strings");
    }
  },
  serialize(value): string {
    if (typeof value === "string") {
      return value;
    } else {
      throw new TypeError("CursorScalar can only serialize strings");
    }
  },
  parseLiteral(ast): string {
    if (ast.kind === Kind.STRING) {
      return ast.value;
    } else {
      throw new TypeError("CursorScalar can only parse literal string values");
    }
  },
});

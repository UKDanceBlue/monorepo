import { GraphQLScalarType } from "graphql";

export const NodeIDScalar = new GraphQLScalarType({
  name: "NodeID",
  description: "Node ID custom scalar type",
  parseValue(value): string {
    if (typeof value === "string") {
      return value;
    } else {
      throw new TypeError("NodeIDScalar can only parse strings");
    }
  },
  serialize(value): string {
    if (typeof value === "string") {
      return value;
    } else {
      throw new TypeError("NodeIDScalar can only serialize strings");
    }
  },
  parseLiteral(): string {
    throw new TypeError("NodeIDScalar should never be used in literal form");
  },
});

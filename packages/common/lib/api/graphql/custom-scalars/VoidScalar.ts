import { GraphQLScalarType } from "graphql";

export const VoidScalar = new GraphQLScalarType<void, 0>({
  name: "Void",
  description: "Void custom scalar type",
  parseValue(): void {
    return;
  },
  serialize(): 0 {
    return 0;
  },
  parseLiteral(): void {
    return;
  }
})

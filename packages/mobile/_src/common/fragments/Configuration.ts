import { graphql } from "@/graphql/index";

export const SimpleConfigFragment = graphql(/* GraphQL */ `
  fragment SimpleConfig on ConfigurationNode {
    id
    key
    value
  }
`);

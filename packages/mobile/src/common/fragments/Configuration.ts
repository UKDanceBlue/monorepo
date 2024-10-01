import { graphql } from "@graphql/index.js";

export const SimpleConfigFragment = graphql(/* GraphQL */ `
  fragment SimpleConfig on ConfigurationNode {
    id
    key
    value
  }
`);

export const FullConfigFragment = graphql(/* GraphQL */ `
  fragment FullConfig on ConfigurationNode {
    ...SimpleConfig
    validAfter
    validUntil
    createdAt
  }
`);

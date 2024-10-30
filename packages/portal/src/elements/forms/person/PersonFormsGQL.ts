import { graphql } from "#graphql/index.js";

export const TeamNameFragment = graphql(/* GraphQL */ `
  fragment TeamNameFragment on TeamNode {
    id
    name
    committeeIdentifier
    marathon {
      year
    }
  }
`);

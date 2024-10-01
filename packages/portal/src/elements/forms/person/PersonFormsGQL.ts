import { graphql } from "@graphql";

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

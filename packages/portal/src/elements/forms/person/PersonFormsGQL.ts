import { graphql } from "@ukdanceblue/common/graphql-client-portal";

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

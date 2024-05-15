import { graphql } from "@ukdanceblue/common/graphql-client-admin";

export const TeamNameFragment = graphql(/* GraphQL */ `
  fragment TeamNameFragment on TeamNode {
    id
    name
  }
`);

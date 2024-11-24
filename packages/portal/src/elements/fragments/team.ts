import { graphql } from "#graphql/gql";

export const TeamSelectFragment = graphql(/* GraphQL */ `
  fragment TeamSelect on TeamNode {
    id
    name
    type
  }
`);

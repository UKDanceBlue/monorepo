import { graphql } from "#graphql/gql.ts";

export const SolicitationCodeTextFragment = graphql(/* GraphQL */ `
  fragment SolicitationCodeText on SolicitationCodeNode {
    id
    text
  }
`);

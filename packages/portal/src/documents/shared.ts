import { graphql } from "#gql/index.js";

export const PaginationFragment = graphql(/* GraphQL */ `
  fragment PaginationFragment on AbstractGraphQLPaginatedResponse {
    total
  }
`);

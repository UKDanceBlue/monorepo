import { graphql } from "#graphql/index.js";

export const PaginationFragment = graphql(/* GraphQL */ `
  fragment PaginationFragment on AbstractGraphQLPaginatedResponse {
    total
  }
`);

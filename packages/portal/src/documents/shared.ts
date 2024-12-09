import { graphql } from "#graphql/index.ts";

export const PaginationFragment = graphql(/* GraphQL */ `
  fragment PaginationFragment on AbstractGraphQLPaginatedResponse {
    page
    pageSize
    total
  }
`);

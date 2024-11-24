import { graphql } from "@/graphql/gql";

export const PaginationFragment = graphql(/* GraphQL */ `
  fragment PaginationFragment on AbstractGraphQLPaginatedResponse {
    page
    pageSize
    total
  }
`);

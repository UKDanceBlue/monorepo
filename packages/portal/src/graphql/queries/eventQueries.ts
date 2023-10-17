import { graphql } from "@ukdanceblue/common/graphql-client-admin";

export const GET_EVENT = graphql(/* GraphQL */ `
  query GetEvent($uuid: String!) {
    event(uuid: $uuid) {
      ok
      clientActions
      data {
        uuid
        ...FullEventWithImages
      }
    }
  }
`);

export const LIST_EVENTS = graphql(/* GraphQL */ `
  query ListEvents(
    $page: Int
    $pageSize: Int
    $sortBy: [String!]
    $sortDirection: [SortDirection!]
    $dateFilters: [EventResolverKeyedDateFilterItem!]
    $isNullFilters: [EventResolverKeyedIsNullFilterItem!]
    $numericFilters: [EventResolverKeyedNumericFilterItem!]
    $oneOfFilters: [EventResolverKeyedOneOfFilterItem!]
    $stringFilters: [EventResolverKeyedStringFilterItem!]
  ) {
    events(
      page: $page
      pageSize: $pageSize
      sortBy: $sortBy
      sortDirection: $sortDirection
      dateFilters: $dateFilters
      isNullFilters: $isNullFilters
      numericFilters: $numericFilters
      oneOfFilters: $oneOfFilters
      stringFilters: $stringFilters
    ) {
      ok
      data {
        uuid
        ...FullEvent
        images {
          uuid
          ...ImageMetadata
        }
      }
      page
      pageSize
      total
    }
  }
`);

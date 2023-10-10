# Redesign of the pagination model

## Current

Very REST-like with `page`, `pageSize`, and `total` properties.

```graphql
interface AbstractGraphQLPaginatedResponse {
  """
  Client actions to perform
  """
  clientActions: [ClientAction!]

  """
  Whether the operation was successful
  """
  ok: Boolean!

  """
  The current page number (1-indexed)
  """
  page: Int!

  """
  The number of items per page
  """
  pageSize: Int!

  """
  The total number of items
  """
  total: Int!
}
```

## Proposed

I would rather follow the best practice proposed by
[https://graphql.org/learn/pagination/] and specified by
[https://relay.dev/graphql/connections.htm]

This is called GraphQL Cursor Connections Specification

> This specification aims to provide an option for GraphQL clients to
> consistently handle pagination best practices with support for related
> metadata via a GraphQL server. This spec proposes calling this pattern
> “Connections” and exposing them in a standardized way.
>
> In the query, the connection model provides a standard mechanism for slicing
> and paginating the result set.
>
> In the response, the connection model provides a standard way of providing
> cursors, and a way of telling the client when more results are available.
>
> An example of all four of those is the following query:

```graphql
{
  user {
    id
    name
    friends(first: 10, after: "opaqueCursor") {
      edges {
        cursor
        node {
          id
          name
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
}
```

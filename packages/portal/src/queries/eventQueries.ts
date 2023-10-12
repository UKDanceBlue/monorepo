import { graphql } from "@ukdanceblue/common/graphql-client-admin";

export const GET_EVENT = graphql(/* GraphQL */ `
  query GetEvent($uuid: String!) {
    event(uuid: $uuid) {
      ok
      clientActions
      data {
        title
        summary
        description
        location
        occurrences
        duration
        images {
          uuid
          url
          imageData
          height
          width
          thumbHash
          alt
        }
      }
    }
  }
`);

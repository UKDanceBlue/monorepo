import { graphql } from "@ukdanceblue/common/graphql-client-admin";

export const CREATE_EVENT = graphql(/* GraphQL */ `
  mutation CreateEvent($input: CreateEventInput!) {
    createEvent(input: $input) {
      ok
      clientActions
      data {
        uuid
      }
    }
  }
`);

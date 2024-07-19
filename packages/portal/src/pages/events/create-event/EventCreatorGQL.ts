import { graphql } from "@ukdanceblue/common/graphql-client-portal";

export const eventCreatorDocument = graphql(/* GraphQL */ `
  mutation CreateEvent($input: CreateEventInput!) {
    createEvent(input: $input) {
      data {
        id
      }
    }
  }
`);

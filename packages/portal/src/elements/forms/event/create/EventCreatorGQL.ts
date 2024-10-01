import { graphql } from "@graphql";

export const eventCreatorDocument = graphql(/* GraphQL */ `
  mutation CreateEvent($input: CreateEventInput!) {
    createEvent(input: $input) {
      data {
        id
      }
    }
  }
`);

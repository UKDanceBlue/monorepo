import { graphql } from "#gql/index.js";

export const eventCreatorDocument = graphql(/* GraphQL */ `
  mutation CreateEvent($input: CreateEventInput!) {
    createEvent(input: $input) {
      id
    }
  }
`);

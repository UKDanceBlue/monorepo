import { graphql } from "@ukdanceblue/common/graphql-client-admin";

export const personCreatorDocument = graphql(/* GraphQL */ `
  mutation PersonCreator($input: CreatePersonInput!) {
    createPerson(input: $input) {
      ok
      uuid
    }
  }
`);

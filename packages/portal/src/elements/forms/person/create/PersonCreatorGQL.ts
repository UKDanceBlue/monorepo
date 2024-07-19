import { graphql } from "@ukdanceblue/common/graphql-client-portal";

export const personCreatorDocument = graphql(/* GraphQL */ `
  mutation PersonCreator($input: CreatePersonInput!) {
    createPerson(input: $input) {
      id
    }
  }
`);

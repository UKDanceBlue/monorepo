import { graphql } from "@/graphql/index.js";

export const personCreatorDocument = graphql(/* GraphQL */ `
  mutation PersonCreator($input: CreatePersonInput!) {
    createPerson(input: $input) {
      id
    }
  }
`);

import { graphql } from "@ukdanceblue/common/graphql-client-admin";

export const createPointEntryDocument = graphql(/* GraphQL */ `
  mutation CreatePointEntry($input: CreatePointEntryInput!) {
    createPointEntry(input: $input) {
      data {
        uuid
      }
    }
  }
`);

import { graphql } from "@ukdanceblue/common/graphql-client-admin";

const ConfigFragment = graphql(/* GraphQL */ `
  fragment ConfigFragment on ConfigurationResource {
    key
    updatedAt
    createdAt
  }
`);

export function useConfig() {}

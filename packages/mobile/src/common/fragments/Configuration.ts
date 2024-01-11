import { graphql } from "@ukdanceblue/common/dist/graphql-client-public";

export const SimpleConfigFragment = graphql(/* GraphQL */ `
  fragment SimpleConfig on ConfigurationResource {
    uuid
    key
    value
  }
`);

export const FullConfigFragment = graphql(/* GraphQL */ `
  fragment FullConfig on ConfigurationResource {
    ...SimpleConfig
    validAfter
    validUntil
    createdAt
  }
`);

import { graphql } from "@ukdanceblue/common/graphql-client-admin";

export const PeopleTableFragment = graphql(/* GraphQL */ `
  fragment PeopleTableFragment on PersonResource {
    uuid
    name
    linkblue
    email
    role {
      dbRole
    }
  }
`);

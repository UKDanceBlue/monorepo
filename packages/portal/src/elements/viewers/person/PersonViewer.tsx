import { graphql } from "@ukdanceblue/common/graphql-client-admin";

export const PersonViewerFragment = graphql(/* GraphQL */ `
  fragment PersonViewerFragment on PersonResource {
    uuid
    name
    linkblue
    email
    role {
      dbRole
      committeeRole
      committeeIdentifier
    }
    teams {
      position
      team {
        uuid
        name
      }
    }
  }
`);

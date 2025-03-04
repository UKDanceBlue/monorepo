import { graphql } from "~/api";

export const ProfileScreenAuthFragment = graphql(/* GraphQL */ `
  fragment ProfileScreenAuthFragment on LoginState {
    dbRole
    authSource
  }
`);

export const ProfileScreenUserFragment = graphql(/* GraphQL */ `
  fragment ProfileScreenUserFragment on PersonNode {
    name
    linkblue
    teams {
      position
      team {
        name
      }
    }
    primaryCommittee {
      identifier
      role
    }
  }
`);

import { graphql } from "@ukdanceblue/common/graphql-client-admin";

export const teamCreatorDocument = graphql(/* GraphQL */ `
  mutation TeamCreator($input: CreateTeamInput!) {
    createTeam(input: $input) {
      ok
      uuid
    }
  }
`);

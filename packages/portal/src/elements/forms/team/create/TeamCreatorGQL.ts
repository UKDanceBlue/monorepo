import { graphql } from "@ukdanceblue/common/graphql-client-portal";

export const teamCreatorDocument = graphql(/* GraphQL */ `
  mutation TeamCreator($input: CreateTeamInput!, $marathonUuid: String!) {
    createTeam(input: $input, marathon: $marathonUuid) {
      ok
      uuid
    }
  }
`);

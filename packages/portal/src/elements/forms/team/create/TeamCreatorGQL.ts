import { graphql } from "@graphql";

export const teamCreatorDocument = graphql(/* GraphQL */ `
  mutation TeamCreator($input: CreateTeamInput!, $marathonUuid: GlobalId!) {
    createTeam(input: $input, marathon: $marathonUuid) {
      ok
      uuid
    }
  }
`);

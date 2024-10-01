import { graphql } from "@graphql/index.js";

export const teamCreatorDocument = graphql(/* GraphQL */ `
  mutation TeamCreator($input: CreateTeamInput!, $marathonUuid: GlobalId!) {
    createTeam(input: $input, marathon: $marathonUuid) {
      ok
      uuid
    }
  }
`);

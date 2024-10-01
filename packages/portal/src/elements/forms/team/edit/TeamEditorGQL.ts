import { graphql } from "@graphql";

export const TeamEditorFragment = graphql(/* GraphQL */ `
  fragment TeamEditorFragment on TeamNode {
    id
    name
    marathon {
      id
      year
    }
    legacyStatus
    type
  }
`);

export const teamEditorDocument = graphql(/* GraphQL */ `
  mutation TeamEditor($uuid: GlobalId!, $input: SetTeamInput!) {
    setTeam(uuid: $uuid, input: $input) {
      ok
    }
  }
`);

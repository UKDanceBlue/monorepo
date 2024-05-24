import { graphql } from "@ukdanceblue/common/graphql-client-admin";

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
  mutation TeamEditor($uuid: String!, $input: SetTeamInput!) {
    setTeam(uuid: $uuid, input: $input) {
      ok
    }
  }
`);

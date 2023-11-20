import { graphql } from "@ukdanceblue/common/graphql-client-admin";

export const TeamEditorFragment = graphql(/* GraphQL */ `
  fragment TeamEditorFragment on TeamResource {
    uuid
    name
    marathonYear
    legacyStatus
    persistentIdentifier
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

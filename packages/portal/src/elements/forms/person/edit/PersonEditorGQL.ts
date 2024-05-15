import { graphql } from "@ukdanceblue/common/graphql-client-admin";

export const PersonEditorFragment = graphql(/* GraphQL */ `
  fragment PersonEditorFragment on PersonNode {
    id
    name
    linkblue
    email
    role {
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

export const personEditorDocument = graphql(/* GraphQL */ `
  mutation PersonEditor($uuid: String!, $input: SetPersonInput!) {
    setPerson(uuid: $uuid, input: $input) {
      ok
    }
  }
`);

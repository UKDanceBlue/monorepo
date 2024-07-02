import { graphql } from "@ukdanceblue/common/graphql-client-admin";

export const PersonEditorFragment = graphql(/* GraphQL */ `
  fragment PersonEditorFragment on PersonNode {
    id
    name
    linkblue
    email
    teams {
      position
      team {
        id
        name
      }
    }
  }
`);

export const personEditorDocument = graphql(/* GraphQL */ `
  mutation PersonEditor($uuid: GlobalId!, $input: SetPersonInput!) {
    setPerson(uuid: $uuid, input: $input) {
      id
    }
  }
`);

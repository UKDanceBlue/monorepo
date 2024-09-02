import { graphql } from "@ukdanceblue/common/graphql-client-portal";

export const PersonEditorFragment = graphql(/* GraphQL */ `
  fragment PersonEditorFragment on PersonNode {
    id
    name
    linkblue
    email
    teams {
      position
      committeeRole
      team {
        id
        name
        marathon {
          year
        }
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

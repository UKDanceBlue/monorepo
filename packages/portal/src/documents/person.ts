import { graphql } from "#graphql/index.js";

export const personCreatorDocument = graphql(/* GraphQL */ `
  mutation PersonCreator($input: CreatePersonInput!) {
    createPerson(input: $input) {
      id
    }
  }
`);

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
        committeeIdentifier
        marathon {
          year
        }
      }
    }
  }
`);

export const personEditorDocument = graphql(/* GraphQL */ `
  mutation PersonEditor($id: GlobalId!, $input: SetPersonInput!) {
    setPerson(id: $id, input: $input) {
      id
    }
  }
`);

export const TeamNameFragment = graphql(/* GraphQL */ `
  fragment TeamNameFragment on TeamNode {
    id
    name
    committeeIdentifier
    marathon {
      year
    }
  }
`);

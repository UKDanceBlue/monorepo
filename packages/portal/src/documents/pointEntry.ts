import { graphql } from "#graphql/index.js";

export const PointEntryCreatorFragment = graphql(/* GraphQL */ `
  fragment PointEntryCreatorFragment on TeamNode {
    id
    members {
      person {
        id
      }
    }
  }
`);

export const createPointEntryDocument = graphql(/* GraphQL */ `
  mutation CreatePointEntry($input: CreatePointEntryInput!) {
    createPointEntry(input: $input) {
      id
    }
  }
`);

export const createPointEntryAndAssignDocument = graphql(/* GraphQL */ `
  mutation CreatePointEntryAndAssign(
    $input: CreatePointEntryInput!
    $person: GlobalId!
    $team: GlobalId!
  ) {
    addPersonToTeam(personUuid: $person, teamUuid: $team) {
      id
    }
    createPointEntry(input: $input) {
      id
    }
  }
`);

export const getPersonByUuidDocument = graphql(/* GraphQL */ `
  query GetPersonByUuid($uuid: GlobalId!) {
    person(uuid: $uuid) {
      id
      name
      linkblue
      teams {
        team {
          id
        }
      }
    }
  }
`);

export const getPersonByLinkBlueDocument = graphql(/* GraphQL */ `
  query GetPersonByLinkBlue($linkBlue: String!) {
    personByLinkBlue(linkBlueId: $linkBlue) {
      id
      name
    }
  }
`);

export const searchPersonByNameDocument = graphql(/* GraphQL */ `
  query SearchPersonByName($name: String!) {
    searchPeopleByName(name: $name) {
      id
      name
    }
  }
`);

export const createPersonByLinkBlue = graphql(/* GraphQL */ `
  mutation CreatePersonByLinkBlue(
    $linkBlue: NonEmptyString!
    $email: EmailAddress!
  ) {
    createPerson(input: { email: $email, linkblue: $linkBlue }) {
      id
    }
  }
`);

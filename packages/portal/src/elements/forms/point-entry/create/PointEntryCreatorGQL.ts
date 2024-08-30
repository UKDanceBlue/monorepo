import { graphql } from "@ukdanceblue/common/graphql-client-portal";

export const createPointEntryDocument = graphql(/* GraphQL */ `
  mutation CreatePointEntry($input: CreatePointEntryInput!) {
    createPointEntry(input: $input) {
      data {
        id
      }
    }
  }
`);

export const getPersonByUuidDocument = graphql(/* GraphQL */ `
  query GetPersonByUuid($uuid: GlobalId!) {
    person(uuid: $uuid) {
      id
      name
      linkblue
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
    $linkBlue: String!
    $email: EmailAddress!
    $teamUuid: GlobalId!
  ) {
    createPerson(
      input: { email: $email, linkblue: $linkBlue, memberOf: [$teamUuid] }
    ) {
      id
    }
  }
`);

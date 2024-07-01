import { graphql } from "@ukdanceblue/common/graphql-client-admin";

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
      data {
        id
        name
        linkblue
      }
    }
  }
`);

export const getPersonByLinkBlueDocument = graphql(/* GraphQL */ `
  query GetPersonByLinkBlue($linkBlue: String!) {
    personByLinkBlue(linkBlueId: $linkBlue) {
      data {
        id
        name
      }
    }
  }
`);

export const searchPersonByNameDocument = graphql(/* GraphQL */ `
  query SearchPersonByName($name: String!) {
    searchPeopleByName(name: $name) {
      data {
        id
        name
      }
    }
  }
`);

export const createPersonByLinkBlue = graphql(/* GraphQL */ `
  mutation CreatePersonByLinkBlue(
    $linkBlue: String!
    $email: EmailAddress!
    $teamUuid: String!
  ) {
    createPerson(
      input: { email: $email, linkblue: $linkBlue, memberOf: [$teamUuid] }
    ) {
      uuid
    }
  }
`);

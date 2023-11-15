import { graphql } from "@ukdanceblue/common/graphql-client-admin";

export const createPointEntryDocument = graphql(/* GraphQL */ `
  mutation CreatePointEntry($input: CreatePointEntryInput!) {
    createPointEntry(input: $input) {
      data {
        uuid
      }
    }
  }
`);

export const getPersonByUuidDocument = graphql(/* GraphQL */ `
  query GetPersonByUuid($uuid: String!) {
    person(uuid: $uuid) {
      data {
        uuid
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
        uuid
        name
      }
    }
  }
`);

export const searchPersonByNameDocument = graphql(/* GraphQL */ `
  query SearchPersonByName($name: String!) {
    searchPeopleByName(name: $name) {
      data {
        uuid
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

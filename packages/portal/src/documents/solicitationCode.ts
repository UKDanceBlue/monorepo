import { graphql } from "#gql/index.js";

import { PaginationFragment } from "./shared";

export const SolicitationCodeTextFragment = graphql(/* GraphQL */ `
  fragment SolicitationCodeText on SolicitationCodeNode {
    id
    text
  }
`);

export const solicitationCodesDocument = graphql(
  /* GraphQL */ `
    query SolicitationCodes {
      solicitationCodes(
        sendAll: true
        sortBy: [
          { direction: asc, field: name }
          { direction: asc, field: text }
        ]
      ) {
        data {
          ...SolicitationCodeText
        }
        ...PaginationFragment
      }
    }
  `,
  [SolicitationCodeTextFragment, PaginationFragment]
);

export const AssignTeamToSolicitationCodeDocument = graphql(/* GraphQL */ `
  mutation AssignTeamToSolicitationCodeDocument(
    $teamId: GlobalId!
    $solicitationCodeId: GlobalId!
  ) {
    assignSolicitationCodeToTeam(teamId: $teamId, id: $solicitationCodeId)
  }
`);

export const UnassignTeamFromSolicitationCodeDocument = graphql(/* GraphQL */ `
  mutation UnassignTeamFromSolicitationCodeDocument($teamId: GlobalId!) {
    removeSolicitationCodeFromTeam(teamId: $teamId)
  }
`);

export const createSolicitationCodeDocument = graphql(/* GraphQL */ `
  mutation CreateSolicitationCode($input: CreateSolicitationCodeInput!) {
    createSolicitationCode(input: $input) {
      id
    }
  }
`);

export const SetSolicitationCodeFragment = graphql(/* GraphQL */ `
  fragment SetSolicitationCode on SolicitationCodeNode {
    id
    name
    text
    tags
  }
`);

export const setSolicitationCodeDocument = graphql(
  /* GraphQL */ `
    mutation SetSolicitationCode(
      $id: GlobalId!
      $input: SetSolicitationCodeInput!
    ) {
      setSolicitationCode(id: $id, input: $input) {
        ...SetSolicitationCode
      }
    }
  `,
  [SetSolicitationCodeFragment]
);

export const solicitationCodeDocument = graphql(
  /* GraphQL */ `
    query SolicitationCode($id: GlobalId!) {
      solicitationCode(id: $id) {
        ...SetSolicitationCode
      }
    }
  `,
  [SetSolicitationCodeFragment]
);

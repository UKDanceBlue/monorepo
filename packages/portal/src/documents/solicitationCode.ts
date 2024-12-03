import { graphql } from "#graphql/index.ts";

export const SolicitationCodeTextFragment = graphql(/* GraphQL */ `
  fragment SolicitationCodeText on SolicitationCodeNode {
    id
    text
  }
`);

export const solicitationCodesDocument = graphql(
  /* GraphQL */ `
    query SolicitationCodes {
      solicitationCodes {
        ...SolicitationCodeText
      }
    }
  `,
  [SolicitationCodeTextFragment]
);

export const AssignTeamToSolicitationCodeDocument = graphql(/* GraphQL */ `
  mutation AssignTeamToSolicitationCodeDocument(
    $teamId: GlobalId!
    $solicitationCodeId: GlobalId!
  ) {
    assignSolicitationCodeToTeam(
      teamId: $teamId
      solicitationCode: $solicitationCodeId
    )
  }
`);

export const UnassignTeamFromSolicitationCodeDocument = graphql(/* GraphQL */ `
  mutation UnassignTeamFromSolicitationCodeDocument($teamId: GlobalId!) {
    removeSolicitationCodeFromTeam(teamId: $teamId)
  }
`);

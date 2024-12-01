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

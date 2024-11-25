import { graphql } from "#graphql/index.js";

export const FundraisingEntryEditorFragment = graphql(/* GraphQL */ `
  fragment FundraisingEntryEditorFragment on FundraisingEntryNode {
    id
    donatedOn
    amount
    notes
    solicitationCode {
      id
      text
    }
    solicitationCodeOverride {
      id
      text
    }
    amountUnassigned
    batchType
    donatedByText
    donatedToText
    dailyDepartmentNotification {
      id
    }
  }
`);

// export const fundraisingEntryEditorDocument = graphql(/* GraphQL */ `
//   mutation FundraisingEntryEditor($uuid: ID!, $input: SetFundraisingEntryInput!) {
//     setFundraisingEntry(uuid: $uuid, input: $input) {
//       ...FundraisingEntryEditorFragment
//     }
//   }
// `);

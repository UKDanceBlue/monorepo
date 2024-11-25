import { Form } from "antd";

import { graphql } from "#graphql/gql.ts";

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

// export function FundraisingEntryEditor() {
//   return (

//   )
// }

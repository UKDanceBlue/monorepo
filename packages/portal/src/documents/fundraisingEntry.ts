import { FundraisingEntryAssignmentTableFragment } from "#elements/tables/fundraising/FundraisingEntryAssignmentsTable.tsx";
import { graphql } from "#graphql/index.js";

export const FundraisingEntryEditorFragment = graphql(
  /* GraphQL */ `
    fragment FundraisingEntryEditorFragment on FundraisingEntryNode {
      id
      donatedOn
      donatedOnOverride
      amount
      amountOverride
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
      batchTypeOverride
      donatedByText
      donatedByOverride
      donatedToText
      donatedToOverride
      dailyDepartmentNotification {
        id
      }
      ...FundraisingEntryAssignmentTableFragment
    }
  `,
  [FundraisingEntryAssignmentTableFragment]
);

export const setFundraisingEntryDocument = graphql(
  /* GraphQL */ `
    mutation SetFundraisingEntry(
      $id: GlobalId!
      $input: SetFundraisingEntryInput!
    ) {
      setFundraisingEntry(id: $id, input: $input) {
        ...FundraisingEntryEditorFragment
      }
    }
  `,
  [FundraisingEntryEditorFragment]
);

export const getFundraisingEntryDocument = graphql(
  /* GraphQL */ `
    query GetFundraisingEntry($id: GlobalId!) {
      fundraisingEntry(id: $id) {
        ...FundraisingEntryEditorFragment
      }
    }
  `,
  [FundraisingEntryEditorFragment]
);

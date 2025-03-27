import { graphql } from "~/api";

const FundraisingDocument = graphql(/* GraphQL */ `
  query FundraisingQuery {
    me {
      fundraisingTotalAmount
      fundraisingAssignments {
        id
        amount
        entry {
          donatedOn
          amount
          notes
          donatedByText
          donatedToText
        }
      }
    }
  }
`);

export default function Fundraising() {
  return null;
}

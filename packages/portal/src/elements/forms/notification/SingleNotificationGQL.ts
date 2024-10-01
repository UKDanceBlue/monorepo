import { graphql } from "@graphql";

export const SingleNotificationFragment = graphql(/* GraphQL */ `
  fragment SingleNotificationFragment on NotificationNode {
    id
    title
    body
    deliveryIssue
    deliveryIssueAcknowledgedAt
    sendAt
    startedSendingAt
    createdAt
    deliveryCount
    deliveryIssueCount {
      DeviceNotRegistered
      InvalidCredentials
      MessageRateExceeded
      MessageTooBig
      MismatchSenderId
      Unknown
    }
  }
`);

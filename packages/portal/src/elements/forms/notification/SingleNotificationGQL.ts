import { graphql } from "@ukdanceblue/common/graphql-client-portal";

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

import { graphql } from "@ukdanceblue/common/graphql-client-admin";

export const SingleNotificationFragment = graphql(/* GraphQL */ `
  fragment SingleNotificationFragment on NotificationResource {
    uuid
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

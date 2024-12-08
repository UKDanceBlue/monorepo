import { graphql } from "#graphql/index.js";

export const createNotificationDocument = graphql(/* GraphQL */ `
  mutation CreateNotification(
    $title: NonEmptyString!
    $body: NonEmptyString!
    $audience: NotificationAudienceInput!
    $url: URL
  ) {
    stageNotification(
      title: $title
      body: $body
      audience: $audience
      url: $url
    ) {
      id
    }
  }
`);

export const cancelNotificationScheduleDocument = graphql(/* GraphQL */ `
  mutation CancelNotificationSchedule($id: GlobalId!) {
    abortScheduledNotification(id: $id) {
      id
    }
  }
`);

export const deleteNotificationDocument = graphql(/* GraphQL */ `
  mutation DeleteNotification($id: GlobalId!, $force: Boolean) {
    deleteNotification(id: $id, force: $force) {
      id
    }
  }
`);

export const sendNotificationDocument = graphql(/* GraphQL */ `
  mutation SendNotification($id: GlobalId!) {
    sendNotification(id: $id)
  }
`);

export const scheduleNotificationDocument = graphql(/* GraphQL */ `
  mutation ScheduleNotification($id: GlobalId!, $sendAt: DateTimeISO!) {
    scheduleNotification(id: $id, sendAt: $sendAt) {
      id
    }
  }
`);

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

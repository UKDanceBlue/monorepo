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
  mutation CancelNotificationSchedule($uuid: GlobalId!) {
    abortScheduledNotification(uuid: $uuid) {
      id
    }
  }
`);

export const deleteNotificationDocument = graphql(/* GraphQL */ `
  mutation DeleteNotification($uuid: GlobalId!, $force: Boolean) {
    deleteNotification(uuid: $uuid, force: $force) {
      id
    }
  }
`);

export const sendNotificationDocument = graphql(/* GraphQL */ `
  mutation SendNotification($uuid: GlobalId!) {
    sendNotification(uuid: $uuid)
  }
`);

export const scheduleNotificationDocument = graphql(/* GraphQL */ `
  mutation ScheduleNotification($uuid: GlobalId!, $sendAt: DateTimeISO!) {
    scheduleNotification(uuid: $uuid, sendAt: $sendAt) {
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

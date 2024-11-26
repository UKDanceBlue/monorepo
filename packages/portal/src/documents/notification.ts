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
      uuid
    }
  }
`);

export const cancelNotificationScheduleDocument = graphql(/* GraphQL */ `
  mutation CancelNotificationSchedule($uuid: GlobalId!) {
    abortScheduledNotification(uuid: $uuid) {
      ok
    }
  }
`);

export const deleteNotificationDocument = graphql(/* GraphQL */ `
  mutation DeleteNotification($uuid: GlobalId!, $force: Boolean) {
    deleteNotification(uuid: $uuid, force: $force) {
      ok
    }
  }
`);

export const sendNotificationDocument = graphql(/* GraphQL */ `
  mutation SendNotification($uuid: GlobalId!) {
    sendNotification(uuid: $uuid) {
      ok
    }
  }
`);

export const scheduleNotificationDocument = graphql(/* GraphQL */ `
  mutation ScheduleNotification($uuid: GlobalId!, $sendAt: DateTimeISO!) {
    scheduleNotification(uuid: $uuid, sendAt: $sendAt) {
      ok
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

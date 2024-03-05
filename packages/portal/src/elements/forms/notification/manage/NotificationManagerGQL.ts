import { graphql } from "@ukdanceblue/common/graphql-client-admin";

export const NotificationManagerFragment = graphql(/* GraphQL */ `
  fragment NotificationManagerFragment on NotificationResource {
    uuid
    title
    body
    deliveryIssue
    deliveryIssueAcknowledgedAt
    sendAt
    startedSendingAt
    createdAt
  }
`);

export const cancelNotificationScheduleDocument = graphql(/* GraphQL */ `
  mutation CancelNotificationSchedule($uuid: String!) {
    abortScheduledNotification(uuid: $uuid) {
      ok
    }
  }
`);

export const deleteNotificationDocument = graphql(/* GraphQL */ `
  mutation DeleteNotification($uuid: String!, $force: Boolean) {
    deleteNotification(uuid: $uuid, force: $force) {
      ok
    }
  }
`);

export const sendNotificationDocument = graphql(/* GraphQL */ `
  mutation SendNotification($uuid: String!) {
    sendNotification(uuid: $uuid) {
      ok
    }
  }
`);

export const scheduleNotificationDocument = graphql(/* GraphQL */ `
  mutation ScheduleNotification($uuid: String!, $sendAt: DateTimeISO!) {
    scheduleNotification(uuid: $uuid, sendAt: $sendAt) {
      ok
    }
  }
`);

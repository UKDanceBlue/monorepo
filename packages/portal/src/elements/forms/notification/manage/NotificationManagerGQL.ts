import { graphql } from "#graphql/index.js";

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

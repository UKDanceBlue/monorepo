import { graphql } from "@ukdanceblue/common/dist/graphql-client-public";

export const NotificationFragment = graphql(/* GraphQL */ `
  fragment NotificationFragment on NotificationResource {
    uuid
    title
    body
    url
  }
`);

export const NotificationDeliveryFragment = graphql(/* GraphQL */ `
  fragment NotificationDeliveryFragment on NotificationDeliveryResource {
    uuid
    sentAt
    notification {
      ...NotificationFragment
    }
  }
`);

export const deviceNotificationsQuery = graphql(/* GraphQL */ `
  query DeviceNotifications(
    $deviceUuid: String!
    $pageSize: Int
    $page: Int
    $verifier: String!
  ) {
    device(uuid: $deviceUuid) {
      data {
        notificationDeliveries(
          pageSize: $pageSize
          page: $page
          verifier: $verifier
        ) {
          ...NotificationDeliveryFragment
        }
      }
    }
  }
`);

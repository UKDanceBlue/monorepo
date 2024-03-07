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

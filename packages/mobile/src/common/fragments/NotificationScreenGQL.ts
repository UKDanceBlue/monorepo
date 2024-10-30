import { graphql } from "#graphql/index";

export const NotificationFragment = graphql(/* GraphQL */ `
  fragment NotificationFragment on NotificationNode {
    id
    title
    body
    url
  }
`);

export const NotificationDeliveryFragment = graphql(/* GraphQL */ `
  fragment NotificationDeliveryFragment on NotificationDeliveryNode {
    id
    sentAt
    notification {
      ...NotificationFragment
    }
  }
`);

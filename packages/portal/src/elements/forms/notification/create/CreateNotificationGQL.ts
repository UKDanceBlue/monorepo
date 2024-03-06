import { graphql } from "@ukdanceblue/common/graphql-client-admin";

export const createNotificationDocument = graphql(/* GraphQL */ `
  mutation CreateNotification(
    $title: String!
    $body: String!
    $audience: NotificationAudienceInput!
    $url: String
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

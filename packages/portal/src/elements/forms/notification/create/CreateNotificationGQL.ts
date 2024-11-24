import { graphql } from "#graphql/index.js";

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

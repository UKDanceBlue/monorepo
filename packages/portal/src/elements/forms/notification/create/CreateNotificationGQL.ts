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

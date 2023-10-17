import { graphql } from "@ukdanceblue/common/graphql-client-admin";

export const EVENT_FRAGMENT = graphql(/* GraphQL */ `
  fragment FullEvent on EventResource {
    title
    summary
    location
    duration
    occurrences
    duration
    description
  }
`);

export const EVENT_IMAGES_FRAGMENT = graphql(/* GraphQL */ `
  fragment EventImages on EventResource {
    images {
      ...FullImage
    }
  }
`);

export const EVENT_WITH_IMAGES_FRAGMENT = graphql(/* GraphQL */ `
  fragment FullEventWithImages on EventResource {
    ...FullEvent
    ...EventImages
  }
`);

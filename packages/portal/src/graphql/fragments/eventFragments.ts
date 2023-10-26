import { graphql } from "@ukdanceblue/common/graphql-client-admin";

export const EVENT_OCCURRENCE_FRAGMENT = graphql(/* GraphQL */ `
  fragment FullEventOccurrence on EventOccurrenceResource {
    uuid
    occurrence
    fullDay
  }
`);

export const EVENT_FRAGMENT = graphql(/* GraphQL */ `
  fragment FullEvent on EventResource {
    title
    summary
    location
    occurrences {
      ...FullEventOccurrence
    }
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

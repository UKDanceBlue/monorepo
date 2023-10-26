import { graphql } from "@ukdanceblue/common/graphql-client-admin";

export const EventOccurrenceFragment = graphql(/* GraphQL */ `
  fragment FullEventOccurrence on EventOccurrenceResource {
    uuid
    occurrence
    fullDay
  }
`);

export const EventFragment = graphql(/* GraphQL */ `
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

export const EventImagesFragment = graphql(/* GraphQL */ `
  fragment EventImages on EventResource {
    images {
      ...FullImage
    }
  }
`);

export const EventWithImagesFragment = graphql(/* GraphQL */ `
  fragment FullEventWithImages on EventResource {
    ...FullEvent
    ...EventImages
  }
`);

import { graphql } from "@ukdanceblue/common/dist/graphql-client-public";

export const EventScreenFragment = graphql(/* GraphQL */ `
  fragment EventScreenFragment on EventResource {
    uuid
    title
    summary
    description
    location
    occurrences {
      uuid
      interval
      fullDay
    }
    images {
      thumbHash
      url
      height
      width
      alt
      mimeType
    }
  }
`);

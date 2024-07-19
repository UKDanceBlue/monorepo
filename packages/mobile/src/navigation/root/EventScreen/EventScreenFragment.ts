import { graphql } from "@ukdanceblue/common/graphql-client-mobile";

export const EventScreenFragment = graphql(/* GraphQL */ `
  fragment EventScreenFragment on EventNode {
    id
    title
    summary
    description
    location
    occurrences {
      id
      interval {
        start
        end
      }
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

import { graphql } from "@ukdanceblue/common/dist/graphql-client-public";

export const EventScreenFragment = graphql(/* GraphQL */ `
  fragment EventScreenFragment on EventNode {
    id
    title
    summary
    description
    location
    occurrences {
      uuid
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

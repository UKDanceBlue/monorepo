import { graphql } from "@ukdanceblue/common/graphql-client-admin";

export const EventEditorFragment = graphql(/* GraphQL */ `
  fragment EventEditorFragment on EventNode {
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
      url
      width
      height
      thumbHash
      alt
    }
  }
`);

export const eventEditorDocument = graphql(/* GraphQL */ `
  mutation SaveEvent($uuid: GlobalId!, $input: SetEventInput!) {
    setEvent(uuid: $uuid, input: $input) {
      data {
        ...EventEditorFragment
      }
    }
  }
`);

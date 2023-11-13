import { graphql } from "@ukdanceblue/common/graphql-client-admin";

export const EventEditorFragment = graphql(/* GraphQL */ `
  fragment EventEditorFragment on EventResource {
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
      url
      imageData
      width
      height
      thumbHash
      alt
    }
  }
`);

export const eventEditorDocument = graphql(/* GraphQL */ `
  mutation SaveEvent($uuid: String!, $input: SetEventInput!) {
    setEvent(uuid: $uuid, input: $input) {
      data {
        ...EventEditorFragment
      }
    }
  }
`);

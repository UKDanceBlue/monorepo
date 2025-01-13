import { graphql } from "#gql/index.js";

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

export const eventEditorQueryDocument = graphql(
  /* GraphQL */ `
    query GetEvent($id: GlobalId!) {
      event(id: $id) {
        ...EventEditorFragment
      }
    }
  `,
  [EventEditorFragment]
);

export const eventEditorMutationDocument = graphql(
  /* GraphQL */ `
    mutation SetEvent($id: GlobalId!, $input: SetEventInput!) {
      setEvent(id: $id, input: $input) {
        ...EventEditorFragment
      }
    }
  `,
  [EventEditorFragment]
);

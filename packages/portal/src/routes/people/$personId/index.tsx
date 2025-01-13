import { createFileRoute } from "@tanstack/react-router";
import { useParams } from "@tanstack/react-router";
import { useQuery } from "urql";

import {
  PersonViewer,
  PersonViewerFragment,
} from "#elements/viewers/person/PersonViewer.js";
import { graphql } from "#gql/index.js";
import { useLoginState } from "#hooks/useLoginState.js";
import { useQueryStatusWatcher } from "#hooks/useQueryStatusWatcher.js";

const viewPersonPageDocument = graphql(
  /* GraphQL */ `
    query ViewPersonPage($id: GlobalId!) {
      person(id: $id) {
        ...PersonViewerFragment
      }
    }
  `,
  [PersonViewerFragment]
);

function ViewPersonPage() {
  const { authorization } = useLoginState();
  const { personId } = useParams({ from: "/people/$personId/" });

  const [{ data, fetching, error }] = useQuery({
    query: viewPersonPageDocument,
    variables: { id: personId },
  });

  useQueryStatusWatcher({
    error,
    fetching,
    loadingMessage: "Loading person...",
  });

  return (
    <div>
      <PersonViewer
        personFragment={data?.person}
        authorization={authorization}
      />
    </div>
  );
}

export const Route = createFileRoute("/people/$personId/")({
  component: ViewPersonPage,
  async beforeLoad({ context, params: { personId } }) {
    await context.urqlClient.query(viewPersonPageDocument, { id: personId });
  },
});

import { createFileRoute } from "@tanstack/react-router";
import { useParams } from "@tanstack/react-router";
import { AccessLevel } from "@ukdanceblue/common";
import { useQuery } from "urql";

import {
  PersonViewer,
  PersonViewerFragment,
} from "#elements/viewers/person/PersonViewer.js";
import { graphql } from "#graphql/index.js";
import { useLoginState } from "#hooks/useLoginState.js";
import { useQueryStatusWatcher } from "#hooks/useQueryStatusWatcher.js";
import { routerAuthCheck } from "#tools/routerAuthCheck.js";

const viewPersonPageDocument = graphql(
  /* GraphQL */ `
    query ViewPersonPage($uuid: GlobalId!) {
      person(uuid: $uuid) {
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
    variables: { uuid: personId },
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
    await context.urqlClient.query(viewPersonPageDocument, { uuid: personId });
    routerAuthCheck(Route, context);
  },
  staticData: {
    authorizationRules: [
      {
        accessLevel: AccessLevel.Committee,
      },
    ],
  },
});

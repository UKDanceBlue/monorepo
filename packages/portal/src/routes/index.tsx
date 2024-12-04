import { createFileRoute } from "@tanstack/react-router";
import { Typography } from "antd";
import { useQuery } from "urql";

import {
  PersonViewer,
  PersonViewerFragment,
} from "#elements/viewers/person/PersonViewer.js";
import { graphql } from "#graphql/index.js";
import { useLoginState } from "#hooks/useLoginState.js";
import { useQueryStatusWatcher } from "#hooks/useQueryStatusWatcher.js";
import { routerAuthCheck } from "#tools/routerAuthCheck.js";

const ViewMePageDocument = graphql(
  /* GraphQL */ `
    query HomePage {
      me {
        ...PersonViewerFragment
      }
    }
  `,
  [PersonViewerFragment]
);

export const Route = createFileRoute("/")({
  component: HomePage,
  beforeLoad({ context }) {
    routerAuthCheck(Route, context);
  },
  staticData: {
    authorizationRules: null,
  },
});

function HomePage() {
  const { authorization } = useLoginState();

  const [{ data, fetching, error }] = useQuery({
    query: ViewMePageDocument,
  });

  useQueryStatusWatcher({
    error,
    fetching,
    loadingMessage: "Loading person...",
  });

  return (
    <div>
      <Typography.Title>
        Welcome to the DanceBlue online portal!
      </Typography.Title>
      {data?.me && (
        <>
          <Typography.Title level={2}>Your Information</Typography.Title>
          <PersonViewer
            personFragment={data.me}
            authorization={authorization}
          />
        </>
      )}
    </div>
  );
}

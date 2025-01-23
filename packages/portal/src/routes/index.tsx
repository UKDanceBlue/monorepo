import { createFileRoute } from "@tanstack/react-router";
import { Typography } from "antd";

import {
  PersonViewer,
  PersonViewerFragment,
} from "#elements/viewers/person/PersonViewer.js";
import { graphql } from "#gql/index.js";
import { useLoginState } from "#hooks/useLoginState.js";
import { useQueryStatusWatcher } from "#hooks/useQueryStatusWatcher.js";
import { useQuery } from "#hooks/useTypedRefine.ts";

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
      <Typography.Title level={2}>What's New?</Typography.Title>
      <Typography.Paragraph>
        <ul>
          <li>
            More of the portal has switched to our new forms, you may see some
            nicer layouts around the place
          </li>
          <li>
            Did some more work on permissions (sorry to those team captains and
            committee members who have had issues)
          </li>
          <li></li>
        </ul>
      </Typography.Paragraph>
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

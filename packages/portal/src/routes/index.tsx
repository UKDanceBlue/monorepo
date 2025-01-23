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
          <li>This list!</li>
          <li>
            The portal has had few big changes to the user interface, namely the
            menu moving to the left; but you will notice some changes to to
            other pages as well. For now this mostly means the events pages, but
            others will come soon.
          </li>
          <li>
            The entire authorization system has been replaced, please contact
            Tech Committee if you have any issues with "Access Denied" errors!
            This change will make it a lot easier to fix these issues in the
            future, but there may be some growing pains.
          </li>
          <li>
            Any public events published to BBNvolved are now automatically
            pulled into the app's database.
          </li>
          <li>More coming soon!</li>
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

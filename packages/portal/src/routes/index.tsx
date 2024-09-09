import { PersonViewer } from "@elements/viewers/person/PersonViewer";
import { useLoginState } from "@hooks/useLoginState";
import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { createFileRoute } from "@tanstack/react-router";
import { routerAuthCheck } from "@tools/routerAuthCheck";
import { graphql } from "@ukdanceblue/common/graphql-client-portal";
import { Typography } from "antd";
import { useQuery } from "urql";

const ViewMePageDocument = graphql(/* GraphQL */ `
  query HomePage {
    me {
      ...PersonViewerFragment
    }
  }
`);

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
      <Typography.Paragraph>
        If you do not recognize this page, you may be looking for the{" "}
        <a href="https://www.danceblue.org">DanceBlue website</a> instead. This
        page is used for online access and entry to the DanceBlue database.
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

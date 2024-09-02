import { PersonViewer } from "@elements/viewers/person/PersonViewer";
import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
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

export function HomePage() {
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
          <PersonViewer personFragment={data.me} />
        </>
      )}
    </div>
  );
}

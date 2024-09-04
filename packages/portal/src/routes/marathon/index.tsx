import { PlusOutlined } from "@ant-design/icons";
import { MarathonsTable } from "@elements/tables/marathon/MarathonsTable";
import { MarathonViewer } from "@elements/viewers/marathon/MarathonViewer";
import { createFileRoute } from "@tanstack/react-router";
import { useLinkProps } from "@tanstack/react-router";
import { graphql } from "@ukdanceblue/common/graphql-client-portal";
import { Button, Empty, Flex } from "antd";
import { useQuery } from "urql";

const marathonOverviewPageDocument = graphql(/* GraphQL */ `
  query MarathonOverviewPage {
    latestMarathon {
      ...MarathonViewerFragment
    }
    marathons(sendAll: true) {
      data {
        ...MarathonTableFragment
      }
    }
  }
`);

function MarathonOverviewPage() {
  const [result] = useQuery({
    query: marathonOverviewPageDocument,
  });

  const router = useLinkProps({ to: "/marathon/create" });

  return (
    <>
      <Flex
        align="center"
        justify="space-between"
        style={{ marginBottom: "1rem" }}
        gap="1rem"
      >
        <h1>Marathon</h1>
        <Button icon={<PlusOutlined />} type="primary" href={router.href}>
          Create New Marathon
        </Button>
      </Flex>
      {result.data?.latestMarathon || result.data?.marathons.data.length ? (
        <div>
          <h2>Current Marathon</h2>
          <MarathonViewer marathon={result.data.latestMarathon} />
          <h2>All Marathons</h2>
          <MarathonsTable marathons={result.data.marathons.data} />
        </div>
      ) : (
        <Empty description="No marathons found" />
      )}
    </>
  );
}

export const Route = createFileRoute("/marathon/")({
  component: MarathonOverviewPage,
});

import { PlusOutlined } from "@ant-design/icons";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button, Empty, Flex } from "antd";
import { useQuery } from "urql";

import {
  MarathonsTable,
  MarathonTableFragment,
} from "#elements/tables/marathon/MarathonsTable.js";
import {
  MarathonViewer,
  MarathonViewerFragment,
} from "#elements/viewers/marathon/MarathonViewer.js";
import { graphql } from "#graphql/index.js";

const marathonOverviewPageDocument = graphql(
  /* GraphQL */ `
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
  `,
  [MarathonViewerFragment, MarathonTableFragment]
);

function MarathonOverviewPage() {
  const [result] = useQuery({
    query: marathonOverviewPageDocument,
  });

  return (
    <>
      <Flex
        align="center"
        justify="space-between"
        style={{ marginBottom: "1rem" }}
        gap="1rem"
      >
        <h1>Marathon</h1>
        <Link from="/marathon" to="create">
          <Button icon={<PlusOutlined />} type="primary">
            Create New Marathon
          </Button>
        </Link>
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

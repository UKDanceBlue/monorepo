import { graphql } from "@ukdanceblue/common/graphql-client-admin";
import { Empty } from "antd";
import { useQuery } from "urql";

import { MarathonViewer } from "../single/view/MarathonViewer";

import { MarathonsTable } from "./MarathonsTable";

const marathonOverviewPageDocument = graphql(/* GraphQL */ `
  query MarathonOverviewPage {
    currentMarathon {
      ...MarathonViewerFragment
    }
    marathons(sendAll: true) {
      data {
        ...MarathonTableFragment
      }
    }
  }
`);

export function MarathonOverviewPage() {
  const [result] = useQuery({
    query: marathonOverviewPageDocument,
  });

  return result.data?.currentMarathon || result.data?.marathons.data.length ? (
    <div>
      <MarathonViewer marathon={result.data.currentMarathon} />
      <MarathonsTable marathons={result.data.marathons.data} />
    </div>
  ) : (
    <Empty description="No marathons found" />
  );
}

import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { graphql } from "@ukdanceblue/common/graphql-client-admin";
import { Table } from "antd";
import { useQuery } from "urql";

const pointEntryTableDocument = graphql(/* GraphQL */ `
  query PointEntryTable($teamUuid: String!) {
    team(uuid: $teamUuid) {
      data {
        pointEntries {
          uuid
          personFrom {
            name
            linkblue
          }
          points
          comment
        }
      }
    }
  }
`);

export function PointEntryTable({ teamUuid }: { teamUuid: string }) {
  const [{ fetching, data: pointEntries, error }] = useQuery({
    query: pointEntryTableDocument,
    variables: { teamUuid },
  });
  useQueryStatusWatcher({
    fetching,
    error,
    loadingMessage: "Loading point entries...",
  });

  return (
    <Table
      dataSource={pointEntries?.team?.data?.pointEntries}
      rowKey="uuid"
      loading={fetching}
      pagination={false}
      columns={[
        {
          title: "Person",
          dataIndex: "personFrom",
          key: "personFrom",
          render: (_, record) =>
            record.personFrom
              ? `${record.personFrom.name} (${record.personFrom.linkblue})`
              : undefined,
        },
        {
          title: "Points",
          dataIndex: "points",
          key: "points",
        },
        {
          title: "Comment",
          dataIndex: "comment",
          key: "comment",
        },
      ]}
    />
  );
}

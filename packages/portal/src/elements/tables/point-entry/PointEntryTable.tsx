import { DeleteOutlined } from "@ant-design/icons";
import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { graphql } from "@ukdanceblue/common/graphql-client-admin";
import { Button, Table } from "antd";
import { useQuery } from "urql";

import { usePointEntryDeletePopup } from "./PointEntryDeletePopup";

// TODO - switch to fragments
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
  const [{ fetching, data: pointEntries, error }, refetch] = useQuery({
    query: pointEntryTableDocument,
    variables: { teamUuid },
  });
  useQueryStatusWatcher({
    fetching,
    error,
    loadingMessage: "Loading point entries...",
  });

  const { PointEntryDeletePopup, showModal: openDeletePopup } =
    usePointEntryDeletePopup({ onDelete: () => refetch() });

  return (
    <>
      {PointEntryDeletePopup}
      <Table
        dataSource={pointEntries?.team.data.pointEntries}
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
                ? `${record.personFrom.name ?? "Never logged in"} (${
                    record.personFrom.linkblue ?? "No Linkblue"
                  })`
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
          {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
              <Button
                icon={<DeleteOutlined />}
                onClick={() => openDeletePopup(record.uuid)}
              />
            ),
          },
        ]}
      />
    </>
  );
}

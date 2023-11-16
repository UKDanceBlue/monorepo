import { DeleteOutlined } from "@ant-design/icons";
import type { FragmentType } from "@ukdanceblue/common/graphql-client-admin";
import {
  getFragmentData,
  graphql,
} from "@ukdanceblue/common/graphql-client-admin";
import { Button, Table } from "antd";

import { usePointEntryDeletePopup } from "./PointEntryDeletePopup";

export const PointEntryTableFragment = graphql(/* GraphQL */ `
  fragment PointEntryTableFragment on PointEntryResource {
    uuid
    personFrom {
      name
      linkblue
    }
    points
    comment
  }
`);

export function PointEntryTable({
  teamFragment,
  loading,
  refetch,
}: {
  teamFragment:
    | readonly FragmentType<typeof PointEntryTableFragment>[]
    | undefined;
  loading: boolean;
  refetch: () => void;
}) {
  const { PointEntryDeletePopup, showModal: openDeletePopup } =
    usePointEntryDeletePopup({ onDelete: () => refetch() });

  const teamData =
    getFragmentData(PointEntryTableFragment, teamFragment) ?? undefined;

  return (
    <>
      {PointEntryDeletePopup}
      <Table
        dataSource={teamData}
        rowKey="uuid"
        loading={loading}
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

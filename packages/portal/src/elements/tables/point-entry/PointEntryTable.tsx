import { DeleteOutlined } from "@ant-design/icons";
import { dateTimeFromSomething } from "@ukdanceblue/common";
import type { FragmentType } from "@ukdanceblue/common/graphql-client-portal";
import {
  getFragmentData,
  graphql,
} from "@ukdanceblue/common/graphql-client-portal";
import { Button, Table } from "antd";
import type { UseQueryExecute } from "urql";

import { usePointEntryDeletePopup } from "./PointEntryDeletePopup";

export const PointEntryTableFragment = graphql(/* GraphQL */ `
  fragment PointEntryTableFragment on PointEntryNode {
    id
    personFrom {
      name
      linkblue
    }
    points
    pointOpportunity {
      name
      opportunityDate
    }
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
  refetch: UseQueryExecute;
}) {
  const { PointEntryDeletePopup, showModal: openDeletePopup } =
    usePointEntryDeletePopup({
      onDelete: () => refetch({ requestPolicy: "network-only" }),
    });

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
            title: "Opportunity",
            dataIndex: "pointOpportunity",
            key: "pointOpportunity",
            render: (_, record) => {
              if (!record.pointOpportunity?.name) {
                return undefined;
              }
              const { name, opportunityDate } = record.pointOpportunity;
              let str = name;
              if (opportunityDate) {
                str += ` (${dateTimeFromSomething(opportunityDate).toFormat(
                  "yyyy-MM-dd"
                )})`;
              }
              return str;
            },
          },
          {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
              <Button
                icon={<DeleteOutlined />}
                onClick={() => openDeletePopup(record.id)}
              />
            ),
          },
        ]}
      />
    </>
  );
}

import type { FragmentType } from "@ukdanceblue/common/graphql-client-admin";
import { graphql } from "@ukdanceblue/common/graphql-client-admin";
import { Empty, Table } from "antd";

export const MarathonTableFragment = graphql(/* GraphQL */ `
  fragment MarathonTableFragment on MarathonResource {
    uuid
    year
    startDate
    endDate
  }
`);

export const MarathonsTable = ({
  marathons,
}: {
  marathons?:
    | readonly FragmentType<typeof MarathonTableFragment>[]
    | null
    | undefined;
}) => {
  return marathons?.length ? (
    <Table dataSource={marathons} rowKey="uuid">
      <Table.Column title="Year" dataIndex="year" sorter />
      <Table.Column title="Start Date" dataIndex="startDate" sorter />
      <Table.Column title="End Date" dataIndex="endDate" sorter />
    </Table>
  ) : (
    <Empty description="No marathons found" />
  );
};

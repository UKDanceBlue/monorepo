import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import type { FragmentType } from "@ukdanceblue/common/graphql-client-admin";
import { graphql } from "@ukdanceblue/common/graphql-client-admin";
import { Button, Empty, Table } from "antd";

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
      <Table.Column
        title="Actions"
        dataIndex="actions"
        render={(_, all) => (
          <>
            <Button
              icon={<EyeOutlined />}
              href={`/marathon/${(all as { uuid?: string }).uuid}`}
            />{" "}
            <Button
              icon={<EditOutlined />}
              href={`/marathon/${(all as { uuid?: string }).uuid}/edit`}
            />
          </>
        )}
      />
    </Table>
  ) : (
    <Empty description="No marathons found" />
  );
};

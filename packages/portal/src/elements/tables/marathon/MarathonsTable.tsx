import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import type { FragmentType } from "@graphql/index.js";
import { graphql } from "@graphql/index.js";
import { Button, Empty, Table } from "antd";

export const MarathonTableFragment = graphql(/* GraphQL */ `
  fragment MarathonTableFragment on MarathonNode {
    id
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
    <Table dataSource={marathons} rowKey="id">
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
              href={`/marathon/${String((all as { id?: string }).id)}`}
            />{" "}
            <Button
              icon={<EditOutlined />}
              href={`/marathon/${String((all as { id?: string }).id)}/edit`}
            />
          </>
        )}
      />
    </Table>
  ) : (
    <Empty description="No marathons found" />
  );
};

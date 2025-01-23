import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { List } from "@refinedev/antd";
import { createFileRoute } from "@tanstack/react-router";
import { Button, Table } from "antd";

import { graphql } from "#gql/index.js";
import { useQueryStatusWatcher } from "#hooks/useQueryStatusWatcher.ts";
import { useQuery } from "#hooks/useTypedRefine.ts";
import { useTypedTable } from "#hooks/useTypedRefine.ts";

const marathonOverviewPageDocument = graphql(/* GraphQL */ `
  query MarathonOverviewPage {
    latestMarathon {
      id
    }
  }
`);

export const MarathonTableFragment = graphql(/* GraphQL */ `
  fragment MarathonTableFragment on MarathonNode {
    id
    year
    startDate
    endDate
  }
`);

function MarathonOverviewPage() {
  const [result] = useQuery({
    query: marathonOverviewPageDocument,
  });
  useQueryStatusWatcher(result);

  const { tableProps } = useTypedTable({
    fragment: MarathonTableFragment,
    props: { resource: "marathon", pagination: { mode: "off" } },
  });

  return (
    <List>
      <Table
        rowKey="id"
        {...tableProps}
        // onRow={(record) => ({
        //   style: {
        //     backgroundColor:
        //       record.id === result.data?.latestMarathon?.id
        //         ? "rgba(0, 0, 0, 0.05)"
        //         : undefined,
        //   },
        // })}
        columns={[
          {
            title: "Latest",
            dataIndex: "id",
            render: (id) => id === result.data?.latestMarathon?.id && "Yes",
          },
          {
            title: "Year",
            dataIndex: "year",
            sorter: true,
          },
          {
            title: "Start Date",
            dataIndex: "startDate",
            sorter: true,
          },
          {
            title: "End Date",
            dataIndex: "endDate",
            sorter: true,
          },
          {
            title: "Actions",
            dataIndex: "actions",
            render: (_, all) => (
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
            ),
          },
        ]}
      />
    </List>
  );
}

export const Route = createFileRoute("/marathon/")({
  component: MarathonOverviewPage,
});

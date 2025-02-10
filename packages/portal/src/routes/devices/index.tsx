import { List } from "@refinedev/antd";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Table } from "antd";

import { RefineSearchForm } from "#elements/components/RefineSearchForm.js";
import { graphql } from "#gql/index.js";
import { useTypedTable } from "#hooks/useTypedRefine.js";

export const Route = createFileRoute("/devices/")({
  component: RouteComponent,
});

const DeviceTableFragment = graphql(/* GraphQL */ `
  fragment DeviceTableFragment on DeviceNode {
    id
    lastLogin
    lastLoggedInUser {
      id
      name
      email
      linkblue
    }
  }
`);

function RouteComponent() {
  const { tableProps, searchFormProps } = useTypedTable({
    fragment: DeviceTableFragment,
    props: {
      resource: "device",
    },
    fieldTypes: {
      lastLogin: "date",
      lastLoggedInUser: ["lastLoggedInUserName", "string"],
    },
  });

  return (
    <List>
      <RefineSearchForm searchFormProps={searchFormProps} />
      <Table
        {...tableProps}
        rowKey="id"
        columns={[
          {
            title: "Last Login",
            dataIndex: "lastLogin",
            sorter: true,
          },
          {
            title: "Last Logged In User",
            dataIndex: "lastLoggedInUser",
            sorter: true,
            render: (_, { lastLoggedInUser }) =>
              lastLoggedInUser?.id ? (
                <Link
                  to="/people/$personId"
                  params={{ personId: lastLoggedInUser.id }}
                >
                  {lastLoggedInUser.name ??
                    lastLoggedInUser.linkblue ??
                    lastLoggedInUser.email}
                </Link>
              ) : null,
          },
        ]}
      />
    </List>
  );
}

import { ShowButton, useTable } from "@refinedev/antd";
import type { HttpError } from "@refinedev/core";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Input, Space, Table } from "antd";
import { useState } from "react";

import { findResourceByGlobalId } from "#config/refine/resources.tsx";
import type { ResultOf, VariablesOf } from "#graphql/index.js";
import { graphql } from "#graphql/index.js";

const fragment = graphql(/* GraphQL */ `
  fragment AuditLogFragment on AuditLogNode {
    id
    summary
    subject {
      id
    }
    details
    user {
      id
      name
      linkblue
      email
    }
    createdAt
  }
`);

const query = graphql(
  `
    query LogsPage(
      $page: PositiveInt!
      $pageSize: PositiveInt!
      $search: NonEmptyString
    ) {
      auditLogs(page: $page, pageSize: $pageSize, search: $search) {
        data {
          ...AuditLogFragment
        }
        total
      }
    }
  `,
  [fragment]
);

function LogsPage() {
  const [search, setSearch] = useState<string | null>(null);
  const { tableProps } = useTable<
    ResultOf<typeof fragment>,
    HttpError,
    VariablesOf<typeof query>
  >({
    meta: {
      gqlQuery: query,
      gqlVariables: {
        search,
      },
    },
  });

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Input.Search
        placeholder="Search"
        onSearch={(value) => setSearch(value)}
        style={{ width: 200 }}
      />
      <Table
        {...tableProps}
        columns={[
          {
            title: "Summary",
            dataIndex: "summary",
            key: "summary",
          },
          {
            title: "Details",
            dataIndex: "details",
            key: "details",
            render: (_, { details }) => (
              <code>
                <pre>{JSON.stringify(details, null, 2)}</pre>
              </code>
            ),
          },
          {
            title: "User",
            dataIndex: "user",
            key: "user",
            render: (_, { user }) =>
              user ? (
                <Link to="/people/$personId" params={{ personId: user.id }}>
                  {user.name ?? user.linkblue ?? user.email}
                </Link>
              ) : (
                "Unknown"
              ),
          },
          {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
          },
          {
            title: "Actions",
            key: "actions",
            render: (_, { subject }) =>
              subject && (
                <ShowButton
                  resource={findResourceByGlobalId(subject.id)?.name}
                  recordItemId={subject.id}
                  hideText
                />
              ),
          },
        ]}
      />
    </Space>
  );
}

export const Route = createFileRoute("/admin/logs")({
  component: LogsPage,
});

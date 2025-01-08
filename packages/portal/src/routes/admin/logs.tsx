import { List, ShowButton, useTable } from "@refinedev/antd";
import type { HttpError } from "@refinedev/core";
import {
  createFileRoute,
  Link,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { Input, Space, Table } from "antd";

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
      $idSearch: NonEmptyString
      $typenameSearch: NonEmptyString
      $textSearch: NonEmptyString
    ) {
      auditLogs(
        page: $page
        pageSize: $pageSize
        idSearch: $idSearch
        typenameSearch: $typenameSearch
        textSearch: $textSearch
      ) {
        data {
          ...AuditLogFragment
        }
        total
      }
    }
  `,
  [fragment]
);

interface LogsPageSearch {
  search?: string;
  typename?: string;
  id?: string;
}

function LogsPage() {
  const navigate = useNavigate({ from: "/admin/logs" });
  const { id, search, typename } = useSearch({ from: "/admin/logs" });

  const { tableProps } = useTable<
    ResultOf<typeof fragment>,
    HttpError,
    VariablesOf<typeof query>
  >({
    meta: {
      gqlQuery: query,
      gqlVariables: {
        textSearch: search,
        idSearch: id,
        typenameSearch: typename,
      },
    },
  });

  return (
    <List
      resource="auditLogs"
      headerButtons={({ defaultButtons }) => (
        <>
          {defaultButtons}
          <Input.Search
            placeholder="Search by text"
            onSearch={(value) =>
              navigate({ search: { search: value || undefined } })
            }
            style={{ width: 200 }}
          />
          <Input.Search
            placeholder="Search by type"
            onSearch={(value) =>
              navigate({ search: { typename: value || undefined } })
            }
            style={{ width: 200 }}
          />
        </>
      )}
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        <Table
          {...tableProps}
          rowKey="id"
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
                <details>
                  <summary>Details</summary>
                  <code>
                    <pre>{JSON.stringify(details, null, 2)}</pre>
                  </code>
                </details>
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
    </List>
  );
}

export const Route = createFileRoute("/admin/logs")({
  component: LogsPage,
  validateSearch: (search) => {
    const searchObj: LogsPageSearch = {};

    if ("search" in search && typeof search.search === "string") {
      searchObj.search = search.search;
    }
    if ("typename" in search && typeof search.typename === "string") {
      searchObj.typename = search.typename;
    }
    if ("id" in search && typeof search.id === "string") {
      searchObj.id = search.id;
    }

    return searchObj;
  },
});

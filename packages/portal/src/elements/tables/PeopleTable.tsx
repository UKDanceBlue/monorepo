import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Link } from "@tanstack/react-router";
import type { CommitteeIdentifier } from "@ukdanceblue/common";
import {
  committeeNames,
  CommitteeRole,
  SortDirection,
  stringifyDbRole,
} from "@ukdanceblue/common";
import { Button, Flex, Table } from "antd";
import { useQuery } from "urql";

import { getFragmentData, graphql } from "#graphql/index.js";
import { useListQuery } from "#hooks/useListQuery.js";
import { useMakeStringSearchFilterProps } from "#hooks/useMakeSearchFilterProps.js";
import { useQueryStatusWatcher } from "#hooks/useQueryStatusWatcher.js";

const PeopleTableFragment = graphql(/* GraphQL */ `
  fragment PeopleTableFragment on PersonNode {
    id
    name
    linkblue
    email
    dbRole
    primaryCommittee {
      identifier
      role
    }
  }
`);

const peopleTableDocument = graphql(/* GraphQL */ `
  query PeopleTable(
    $page: Int
    $pageSize: Int
    $sortBy: [String!]
    $sortDirection: [SortDirection!]
    $isNullFilters: [PersonResolverKeyedIsNullFilterItem!]
    $oneOfFilters: [PersonResolverKeyedOneOfFilterItem!]
    $stringFilters: [PersonResolverKeyedStringFilterItem!]
  ) {
    listPeople(
      page: $page
      pageSize: $pageSize
      sortBy: $sortBy
      sortDirection: $sortDirection
      isNullFilters: $isNullFilters
      oneOfFilters: $oneOfFilters
      stringFilters: $stringFilters
    ) {
      page
      pageSize
      total
      data {
        ...PeopleTableFragment
      }
    }
  }
`);

export const PeopleTable = () => {
  const {
    queryOptions,
    updatePagination,
    clearSorting,
    pushSorting,
    clearFilters,
    updateFilter,
    clearFilter,
  } = useListQuery(
    {
      initPage: 1,
      initPageSize: 20,
      initSorting: [],
    },
    {
      allFields: [
        "name",
        "email",
        "linkblue",
        "dbRole",
        "committeeRole",
        "committeeName",
      ],
      dateFields: [],
      booleanFields: [],
      isNullFields: [],
      numericFields: [],
      oneOfFields: ["dbRole", "committeeRole", "committeeName"],
      stringFields: ["name", "email", "linkblue"],
    }
  );

  const [{ fetching, error, data: peopleDocument }] = useQuery({
    query: peopleTableDocument,
    variables: queryOptions,
  });
  useQueryStatusWatcher({
    error,
    fetching,
    loadingMessage: "Loading people...",
  });

  const listPeopleData = getFragmentData(
    PeopleTableFragment,
    peopleDocument?.listPeople.data
  );

  return (
    <>
      <Table
        dataSource={listPeopleData ?? undefined}
        loading={fetching}
        onChange={(pagination, filters, sorter, _extra) => {
          updatePagination({
            page: pagination.current,
            pageSize: pagination.pageSize,
          });
          clearSorting();
          for (const sort of Array.isArray(sorter) ? sorter : [sorter]) {
            if (!sort.order) {
              continue;
            }
            pushSorting({
              field: sort.field as
                | "name"
                | "email"
                | "linkblue"
                | "dbRole"
                | "committeeRole"
                | "committeeName",
              direction:
                sort.order === "ascend"
                  ? SortDirection.asc
                  : SortDirection.desc,
            });
          }
          clearFilters();
          for (const key of Object.keys(filters)) {
            const value = filters[key];
            if (!value) {
              continue;
            }
            switch (key) {
              case "dbRole": {
                updateFilter("dbRole", {
                  field: "dbRole",
                  value: value.map((v) => v.toString()),
                });
                break;
              }
              case "committeeRole": {
                updateFilter("committeeRole", {
                  field: "committeeRole",
                  value: value.map((v) => v.toString()),
                });
                break;
              }
              case "committeeName": {
                updateFilter("committeeName", {
                  field: "committeeName",
                  value: value.map((v) => v.toString()),
                });
                break;
              }
            }
          }
        }}
        pagination={
          peopleDocument
            ? {
                current: peopleDocument.listPeople.page,
                pageSize: peopleDocument.listPeople.pageSize,
                total: peopleDocument.listPeople.total,
                showSizeChanger: true,
              }
            : false
        }
        rowKey={({ id }) => id}
        sortDirections={["ascend", "descend"]}
        columns={[
          {
            title: "Name",
            dataIndex: "name",
            sorter: true,
            sortDirections: ["ascend", "descend"],
            ...useMakeStringSearchFilterProps(
              "name",
              updateFilter,
              clearFilter
            ),
          },
          {
            title: "Email",
            dataIndex: "email",
            sorter: true,
            sortDirections: ["ascend", "descend"],
            ...useMakeStringSearchFilterProps(
              "email",
              updateFilter,
              clearFilter
            ),
          },
          {
            title: "Linkblue",
            dataIndex: "linkblue",
            sorter: true,
            sortDirections: ["ascend", "descend"],
            ...useMakeStringSearchFilterProps(
              "linkblue",
              updateFilter,
              clearFilter
            ),
          },
          {
            title: "Role",
            dataIndex: "dbRole",
            render: (_, record) => {
              return stringifyDbRole(record.dbRole);
            },
            sorter: false,
          },
          {
            title: "Committee Role",
            dataIndex: "committeeRole",
            render: (_, record) => {
              // TODO: fix
              return record.primaryCommittee?.role ?? "None";
            },
            sorter: false,
            filters: Object.values(CommitteeRole).map((role) => ({
              text: String(role),
              value: String(role),
            })),
          },
          {
            title: "Committee Name",
            dataIndex: "committeeName",
            render: (_, record) => {
              // TODO: fix
              return record.primaryCommittee?.identifier
                ? committeeNames[record.primaryCommittee.identifier]
                : "None";
            },
            sorter: false,
            filters: Object.keys(committeeNames).map((committeeIdentifier) => ({
              text: committeeNames[committeeIdentifier as CommitteeIdentifier],
              value: committeeIdentifier,
            })),
          },
          {
            title: "Actions",
            dataIndex: "actions",
            render: (_, record) => {
              return (
                <Flex gap="small" align="center">
                  <Link
                    from="/people"
                    to="$personId"
                    params={{ personId: record.id }}
                  >
                    <Button icon={<EyeOutlined />} />
                  </Link>
                  <Link
                    from="/people"
                    to="$personId/edit"
                    params={{ personId: record.id }}
                  >
                    <Button icon={<EditOutlined />} />
                  </Link>
                </Flex>
              );
            },
          },
        ]}
      />
    </>
  );
};

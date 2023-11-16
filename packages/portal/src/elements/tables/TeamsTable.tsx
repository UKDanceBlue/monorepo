import { useListQuery } from "@hooks/useListQuery";
import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { Link } from "@tanstack/react-router";
import { SortDirection } from "@ukdanceblue/common";
import { graphql } from "@ukdanceblue/common/graphql-client-admin";
import { Table } from "antd";
import { useQuery } from "urql";

const teamsTableQueryDocument = graphql(/* GraphQL */ `
  query TeamsTable(
    $page: Int
    $pageSize: Int
    $sortBy: [String!]
    $sortDirection: [SortDirection!]
    $isNullFilters: [TeamResolverKeyedIsNullFilterItem!]
    $oneOfFilters: [TeamResolverKeyedOneOfFilterItem!]
    $stringFilters: [TeamResolverKeyedStringFilterItem!]
  ) {
    teams(
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
        name
        uuid
        visibility
        legacyStatus
        marathonYear
        totalPoints
      }
    }
  }
`);

export const TeamsTable = () => {
  const { queryOptions, updatePagination, clearSorting, pushSorting } =
    useListQuery(
      {
        initPage: 1,
        initPageSize: 10,
        initSorting: [
          { field: "totalPoints", direction: SortDirection.DESCENDING },
        ],
      },
      {
        allFields: [
          "name",
          "type",
          "legacyStatus",
          "visibility",
          "marathonYear",
          "totalPoints",
        ],
        dateFields: [],
        isNullFields: [],
        numericFields: [],
        oneOfFields: [],
        stringFields: [],
      }
    );
  const [{ fetching, error, data }] = useQuery({
    query: teamsTableQueryDocument,
    variables: queryOptions,
  });
  useQueryStatusWatcher({
    fetching,
    error,
    loadingMessage: "Loading teams...",
  });

  return (
    <Table
      columns={[
        {
          title: "Name",
          dataIndex: "name",
          sorter: true,
          defaultSortOrder: "descend",
        },
        {
          title: "Type",
          dataIndex: "type",
          sorter: true,
          defaultSortOrder: "descend",
        },
        {
          title: "Legacy Status",
          dataIndex: "legacyStatus",
          sorter: true,
          defaultSortOrder: "descend",
        },
        {
          title: "Visibility",
          dataIndex: "visibility",
          sorter: true,
          defaultSortOrder: "descend",
        },
        {
          title: "Marathon Year",
          dataIndex: "marathonYear",
          sorter: true,
          defaultSortOrder: "descend",
        },
        {
          title: "Total Points",
          dataIndex: "totalPoints",
          sorter: true,
          defaultSortOrder: "descend",
        },
        {
          title: "Actions",
          key: "actions",
          render: (_text, record) => (
            <Link to="/teams/$teamId/" params={{ teamId: record.uuid }}>
              View
            </Link>
          ),
        },
      ]}
      dataSource={data?.teams.data}
      loading={fetching}
      rowKey={({ uuid }) => uuid}
      pagination={
        data
          ? {
              current: data.teams.page,
              pageSize: data.teams.pageSize,
              total: data.teams.total,
              showSizeChanger: true,
            }
          : false
      }
      sortDirections={["ascend", "descend"]}
      onChange={(pagination, _filters, sorter, _extra) => {
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
              | "totalPoints"
              | "name"
              | "type"
              | "legacyStatus"
              | "visibility"
              | "marathonYear",
            direction:
              sort.order === "ascend"
                ? SortDirection.ASCENDING
                : SortDirection.DESCENDING,
          });
        }
      }}
    />
  );
};

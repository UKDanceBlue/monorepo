import { useListQuery } from "@hooks/useListQuery";
import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { Link } from "@tanstack/react-router";
import { SortDirection } from "@ukdanceblue/common";
import {
  getFragmentData,
  graphql,
} from "@ukdanceblue/common/graphql-client-admin";
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
        ...TeamsTableFragment
      }
    }
  }
`);

export const TeamsTableFragment = graphql(/* GraphQL */ `
  fragment TeamsTableFragment on TeamResource {
    uuid
    type
    name
    legacyStatus
    marathonYear
    totalPoints
  }
`);

export const TeamsTable = () => {
  const {
    queryOptions,
    updatePagination,
    clearSorting,
    pushSorting,
    clearFilters,
    updateFilter,
  } = useListQuery(
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
        "marathonYear",
        "totalPoints",
      ],
      dateFields: [],
      isNullFields: [],
      numericFields: [],
      oneOfFields: ["type", "marathonYear", "legacyStatus"],
      stringFields: [],
    }
  );
  const [{ fetching, error, data }] = useQuery({
    query: teamsTableQueryDocument,
    variables: queryOptions,
    requestPolicy: "network-only",
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
        },
        {
          title: "Type",
          dataIndex: "type",
          sorter: true,
          filters: [
            {
              text: "Committee",
              value: "Committee",
            },
            {
              text: "Spirit",
              value: "Spirit",
            },
          ],
        },
        {
          title: "Legacy Status",
          dataIndex: "legacyStatus",
          sorter: true,
          filters: [
            {
              text: "New Team",
              value: "NewTeam",
            },
            {
              text: "Returning Team",
              value: "ReturningTeam",
            },
          ],
          render: (value) => {
            switch (value) {
              case "NewTeam": {
                return "New Team";
              }
              case "ReturningTeam": {
                return "Returning Team";
              }
              default: {
                return String(value);
              }
            }
          },
        },
        {
          title: "Marathon Year",
          dataIndex: "marathonYear",
          sorter: true,
          filters: [
            {
              text: "DanceBlue 2024",
              value: "DB24",
            },
          ],
        },
        {
          title: "Total Points",
          dataIndex: "totalPoints",
          sorter: true,
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
      dataSource={
        getFragmentData(TeamsTableFragment, data?.teams.data) ?? undefined
      }
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
              | "totalPoints"
              | "name"
              | "type"
              | "legacyStatus"
              | "marathonYear",
            direction:
              sort.order === "ascend"
                ? SortDirection.ASCENDING
                : SortDirection.DESCENDING,
          });
        }
        clearFilters();
        for (const key of Object.keys(filters)) {
          const value = filters[key];
          if (!value) {
            continue;
          }
          switch (key) {
            case "type": {
              updateFilter("type", {
                field: "type",
                value: value.map((v) => v.toString()),
              });
              break;
            }
            case "legacyStatus": {
              updateFilter("legacyStatus", {
                field: "legacyStatus",
                value: value.map((v) => v.toString()),
              });
              break;
            }
            case "marathonYear": {
              updateFilter("marathonYear", {
                field: "marathonYear",
                value: value.map((v) => v.toString()),
              });
              break;
            }
            default: {
              console.error("Unhandled filter key", key);
              break;
            }
          }
        }
      }}
    />
  );
};

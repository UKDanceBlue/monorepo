import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { useMarathon } from "@config/marathonContext";
import { useListQuery } from "@hooks/useListQuery";
import { useMakeStringSearchFilterProps } from "@hooks/useMakeSearchFilterProps";
import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { useNavigate } from "@tanstack/react-router";
import { SortDirection, TeamLegacyStatus, TeamType } from "@ukdanceblue/common";
import {
  getFragmentData,
  graphql,
} from "@ukdanceblue/common/graphql-client-admin";
import { Button, Flex, Table } from "antd";
import { useEffect } from "react";
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
  fragment TeamsTableFragment on TeamNode {
    id
    type
    name
    legacyStatus
    totalPoints
  }
`);

export const TeamsTable = () => {
  const navigate = useNavigate();

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
      initSorting: [{ field: "totalPoints", direction: SortDirection.desc }],
    },
    {
      allFields: ["name", "type", "legacyStatus", "marathonId", "totalPoints"],
      dateFields: [],
      isNullFields: [],
      numericFields: ["totalPoints"],
      oneOfFields: ["type", "marathonId", "legacyStatus"],
      stringFields: ["name"],
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

  const marathonId = useMarathon()?.id;

  useEffect(() => {
    if (
      queryOptions.oneOfFilters.filter((f) => f.field === "marathonId")
        .length === 0
    ) {
      if (marathonId) {
        updateFilter("marathonId", {
          field: "marathonId",
          value: [marathonId],
        });
      }
    }
  }, [marathonId, queryOptions.oneOfFilters, updateFilter]);

  return (
    <Table
      columns={[
        {
          title: "Name",
          dataIndex: "name",
          sorter: true,
          ...useMakeStringSearchFilterProps("name", updateFilter, clearFilter),
        },
        {
          title: "Type",
          dataIndex: "type",
          sorter: true,
          filters: Object.entries(TeamType).map(([key, value]) => ({
            text: key,
            value,
          })),
        },
        {
          title: "Legacy Status",
          dataIndex: "legacyStatus",
          sorter: true,
          filters: Object.values(TeamLegacyStatus).map((value) => {
            let text: string;
            switch (value) {
              case TeamLegacyStatus.NewTeam: {
                text = "New Team";
                break;
              }
              case TeamLegacyStatus.ReturningTeam: {
                text = "Returning Team";
                break;
              }
              case TeamLegacyStatus.DemoTeam: {
                text = "Demo Team";
                break;
              }
              default: {
                value satisfies never;
                text = String(value);
                break;
              }
            }
            return {
              text,
              value,
            };
          }),
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
          title: "Total Points",
          dataIndex: "totalPoints",
          sorter: true,
        },
        {
          title: "Actions",
          key: "actions",
          render: (_text, record) => (
            <Flex gap="small" align="center">
              <Button
                onClick={() =>
                  navigate({
                    to: "/teams/$teamId/",
                    params: { teamId: record.id },
                  }).catch((error: unknown) => console.error(error))
                }
                icon={<EyeOutlined />}
              />
              <Button
                onClick={() =>
                  navigate({
                    to: "/teams/$teamId/edit",
                    params: { teamId: record.id },
                  }).catch((error: unknown) => console.error(error))
                }
                icon={<EditOutlined />}
              />
            </Flex>
          ),
        },
      ]}
      dataSource={
        getFragmentData(TeamsTableFragment, data?.teams.data) ?? undefined
      }
      loading={fetching}
      rowKey={({ id }) => id}
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
              | "marathonId",
            direction:
              sort.order === "ascend" ? SortDirection.asc : SortDirection.desc,
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
            case "marathonId": {
              updateFilter("marathonId", {
                field: "marathonId",
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

import { DollarOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Link } from "@tanstack/react-router";
import {
  SortDirection,
  TeamLegacyStatus,
  TeamLegacyStatusValues,
  TeamTypeValues,
} from "@ukdanceblue/common";
import { Button, Flex, Table } from "antd";
import type { ReactNode } from "react";
import { useEffect } from "react";

import type { TeamsTableFragmentFragment } from "@/graphql/graphql";
import type { FragmentType } from "@/graphql/index.js";
import { getFragmentData, graphql } from "@/graphql/index.js";
import type { UseListQueryHookReturn } from "@/hooks/useListQuery.js";
import { useMakeStringSearchFilterProps } from "@/hooks/useMakeSearchFilterProps.js";

import { PaginationFragment } from "../fragments/generic";

export const TeamsTableFragment = graphql(/* GraphQL */ `
  fragment TeamsTableFragment on TeamNode {
    id
    type
    name
    legacyStatus
    totalPoints
  }
`);

export const TeamsTable = ({
  selectedMarathonId,
  dataFragment,
  paginationFragment,
  listQuery,
  loading,
  additionalActions,
}: {
  selectedMarathonId?: string | undefined;
  dataFragment: readonly FragmentType<typeof TeamsTableFragment>[] | undefined;
  paginationFragment?: FragmentType<typeof PaginationFragment> | undefined;
  listQuery?:
    | UseListQueryHookReturn<
        "totalPoints" | "name" | "type" | "legacyStatus" | "marathonId",
        never,
        "totalPoints",
        "name",
        "type" | "legacyStatus" | "marathonId",
        never,
        never
      >
    | undefined;
  loading: boolean;
  additionalActions?: {
    icon: ReactNode;
    onClick: (record: TeamsTableFragmentFragment) => void;
    key?: string;
  }[];
}) => {
  useEffect(() => {
    if (!listQuery) {
      return;
    }
    if (
      listQuery.queryOptions.oneOfFilters.find((f) => f.field === "marathonId")
        ?.value[0] !== selectedMarathonId
    ) {
      if (selectedMarathonId) {
        listQuery.updateFilter("marathonId", {
          field: "marathonId",
          value: [selectedMarathonId],
        });
      }
    }
  }, [selectedMarathonId, listQuery]);

  const data = getFragmentData(TeamsTableFragment, dataFragment);
  const pagination = getFragmentData(PaginationFragment, paginationFragment);

  return (
    <Table
      columns={[
        {
          title: "Name",
          dataIndex: "name",
          sorter: listQuery != null,
          ...useMakeStringSearchFilterProps(
            "name",
            listQuery?.updateFilter,
            listQuery?.clearFilter
          ),
        },
        {
          title: "Type",
          dataIndex: "type",
          sorter: listQuery != null,
          filters: TeamTypeValues.map((key) => ({
            text: key,
            value: key,
          })),
        },
        {
          title: "Legacy Status",
          dataIndex: "legacyStatus",
          sorter: listQuery != null,
          filters: TeamLegacyStatusValues.map((value) => {
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
          sorter: listQuery != null,
        },
        {
          title: "Actions",
          key: "actions",
          render: (_text, record) => (
            <Flex gap="small" align="center">
              <Link to="/teams/$teamId/points" params={{ teamId: record.id }}>
                <Button icon={<EyeOutlined />} />
              </Link>
              <Link
                to="/teams/$teamId/fundraising"
                params={{ teamId: record.id }}
              >
                <Button icon={<DollarOutlined />} />
              </Link>
              <Link to="/teams/$teamId/edit" params={{ teamId: record.id }}>
                <Button icon={<EditOutlined />} />
              </Link>
              {additionalActions?.map((action, i) => (
                <Button
                  key={action.key ?? i}
                  icon={action.icon}
                  onClick={() => action.onClick(record)}
                />
              ))}
            </Flex>
          ),
        },
      ]}
      dataSource={data ?? undefined}
      loading={loading}
      rowKey={({ id }) => id}
      pagination={
        pagination
          ? {
              current: pagination.page,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
            }
          : false
      }
      sortDirections={["ascend", "descend"]}
      onChange={(pagination, filters, sorter, _extra) => {
        if (!listQuery) {
          return;
        }
        const {
          pushSorting,
          clearSorting,
          updatePagination,
          clearFilters,
          updateFilter,
        } = listQuery;

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

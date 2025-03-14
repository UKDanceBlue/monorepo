import { UploadOutlined } from "@ant-design/icons";
import { DollarOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { CreateButton, getDefaultSortOrder, List } from "@refinedev/antd";
import { getDefaultFilter } from "@refinedev/core";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  TeamLegacyStatus,
  TeamLegacyStatusValues,
  TeamType,
  TeamTypeValues,
} from "@ukdanceblue/common";
import { Button, Flex, Space, Table } from "antd";

import { useMarathon } from "#config/marathonContext.js";
import { Authorized } from "#elements/components/Authorized.tsx";
import { RefineSearchForm } from "#elements/components/RefineSearchForm.js";
import { graphql } from "#gql/index.js";
import { useTypedTable } from "#hooks/refine/table.js";
import { useAuthorizationRequirement } from "#hooks/useLoginState.js";

export const TeamsTableFragment = graphql(/* GraphQL */ `
  fragment TeamsTableFragment on TeamNode {
    id
    type
    name
    legacyStatus
    totalPoints
  }
`);

export function ListTeamsPage() {
  const { year: marathonYear } = useMarathon() ?? {};

  const { tableProps, searchFormProps, filters, sorters } = useTypedTable({
    fragment: TeamsTableFragment,
    props: {
      resource: "team",
      filters: {
        permanent: [
          {
            field: "marathonYear",
            value: marathonYear,
            operator: "eq",
          },
        ],
        initial: [
          {
            field: "type",
            value: [TeamType.Spirit],
            operator: "in",
          },
        ],
      },
      sorters: {
        initial: [
          {
            field: "totalPoints",
            order: "desc",
          },
        ],
      },
    },
    fieldTypes: {
      name: "string",
      type: "string",
      legacyStatus: "string",
    },
  });

  return (
    <List
      headerButtons={
        <Authorized action="create" subject="TeamNode">
          <Space.Compact>
            <CreateButton type="default" />
            <Link from="/teams" to="bulk">
              <Button icon={<UploadOutlined />}>Import Teams</Button>
            </Link>
          </Space.Compact>
        </Authorized>
      }
    >
      <RefineSearchForm searchFormProps={searchFormProps} />
      <Table
        {...tableProps}
        rowKey="id"
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
            filters: TeamTypeValues.map((key) => ({
              text: key,
              value: key,
            })),
            defaultFilteredValue: getDefaultFilter("type", filters, "in"),
          },
          {
            title: "Legacy Status",
            dataIndex: "legacyStatus",
            sorter: true,
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
            sorter: true,
            defaultSortOrder: getDefaultSortOrder("totalPoints", sorters),
          },
          {
            title: "Actions",
            key: "actions",
            render(_, { id }) {
              return <TeamActions id={id} />;
            },
          },
        ]}
      />
    </List>
  );
}

export const Route = createFileRoute("/teams/")({
  component: ListTeamsPage,
});

function TeamActions({ id }: { id: string }) {
  return (
    <Flex gap="small" align="center">
      {useAuthorizationRequirement("get", { id, kind: "TeamNode" }) && (
        <Link to="/teams/$teamId/points" params={{ teamId: id }}>
          <Button icon={<EyeOutlined />} />
        </Link>
      )}
      {useAuthorizationRequirement(
        "get",
        { id, kind: "TeamNode" },
        ".fundraisingEntries"
      ) && (
        <Link to="/teams/$teamId/fundraising" params={{ teamId: id }}>
          <Button icon={<DollarOutlined />} />
        </Link>
      )}
      {useAuthorizationRequirement("update", { id, kind: "TeamNode" }) && (
        <Link to="/teams/$teamId/edit" params={{ teamId: id }}>
          <Button icon={<EditOutlined />} />
        </Link>
      )}
    </Flex>
  );
}

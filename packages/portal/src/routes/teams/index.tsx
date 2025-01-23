import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { DollarOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { List } from "@refinedev/antd";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  TeamLegacyStatus,
  TeamLegacyStatusValues,
  TeamTypeValues,
} from "@ukdanceblue/common";
import { Button, Flex, Table } from "antd";

import { useMarathon } from "#config/marathonContext.ts";
import { RefineSearchForm } from "#elements/components/RefineSearchForm.tsx";
import { graphql } from "#gql/index.js";
import { useAuthorizationRequirement } from "#hooks/useLoginState.js";
import { useTypedTable } from "#hooks/useTypedRefine.ts";

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

  const { tableProps, searchFormProps } = useTypedTable({
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
        useAuthorizationRequirement("create", "TeamNode") && (
          <div style={{ display: "flex", gap: 16 }}>
            <Link from="/teams" to="create">
              <Button icon={<PlusOutlined />} size="large">
                Create Team
              </Button>
            </Link>
            <Link from="/teams" to="bulk">
              <Button icon={<UploadOutlined />} size="large">
                Bulk Create Teams
              </Button>
            </Link>
          </div>
        )
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

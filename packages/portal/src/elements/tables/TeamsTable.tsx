import { DollarOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Link } from "@tanstack/react-router";
import {
  TeamLegacyStatus,
  TeamLegacyStatusValues,
  TeamTypeValues,
} from "@ukdanceblue/common";
import { Button, Flex, Table } from "antd";
import type { ReactNode } from "react";

import { useMarathon } from "#config/marathonContext.js";
import { RefineSearchForm } from "#elements/components/RefineSearchForm.js";
import { graphql } from "#gql/index.js";
import { useTypedTable } from "#hooks/useTypedRefine.js";

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
  showAllMarathons,
  additionalActions,
}: {
  showAllMarathons?: boolean;
  additionalActions?: {
    icon: ReactNode;
    onClick: (record: { id: string }) => void;
    key?: string;
  }[];
}) => {
  const { year: marathonYear } = useMarathon() ?? {};

  const { tableProps, searchFormProps } = useTypedTable({
    fragment: TeamsTableFragment,
    props: {
      resource: "team",
      filters: {
        permanent: showAllMarathons
          ? [
              {
                field: "marathonYear",
                value: marathonYear,
                operator: "eq",
              },
            ]
          : [],
      },
    },
    fieldTypes: {
      name: "string",
      type: "string",
      legacyStatus: "string",
    },
  });

  return (
    <>
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
      />
    </>
  );
};

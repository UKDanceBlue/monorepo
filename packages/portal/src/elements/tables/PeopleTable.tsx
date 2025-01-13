import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Link } from "@tanstack/react-router";
import type { CommitteeIdentifier } from "@ukdanceblue/common";
import {
  committeeNames,
  CommitteeRole,
  SortDirection,
} from "@ukdanceblue/common";
import { Button, Flex, Table } from "antd";

import { RefineSearchForm } from "#elements/components/RefineSearchForm.tsx";
import { graphql } from "#gql/index.js";
import { useTypedTable } from "#hooks/useTypedRefine.ts";

const PeopleTableFragment = graphql(/* GraphQL */ `
  fragment PeopleTableFragment on PersonNode {
    id
    name
    linkblue
    email
    primaryCommittee {
      identifier
      role
    }
  }
`);

export const PeopleTable = () => {
  const { tableProps, searchFormProps } = useTypedTable({
    fragment: PeopleTableFragment,
    props: {
      resource: "person",
      sorters: {
        initial: [
          {
            field: "name",
            order: SortDirection.asc,
          },
        ],
      },
    },
    fieldTypes: {
      committeeRole: "string",
      committeeName: "string",
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
            title: "Email",
            dataIndex: "email",
            sorter: true,
          },
          {
            title: "Linkblue",
            dataIndex: "linkblue",
            sorter: true,
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

import { PlusOutlined } from "@ant-design/icons";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { getDefaultSortOrder, List } from "@refinedev/antd";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { CommitteeIdentifier } from "@ukdanceblue/common";
import {
  committeeNames,
  CommitteeRole,
  SortDirection,
} from "@ukdanceblue/common";
import { Button, Flex, Table } from "antd";

import { Authorized } from "#elements/components/Authorized.js";
import { RefineSearchForm } from "#elements/components/RefineSearchForm.js";
import { UploadPersonButton } from "#elements/forms/person/create/BulkPersonCreator.js";
import { graphql } from "#gql/index.js";
import { withAuthorized } from "#hooks/useLoginState.js";
import { useTypedTable } from "#hooks/useTypedRefine.js";

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

function ListPeoplePage() {
  const { tableProps, searchFormProps, sorters } = useTypedTable({
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
    <List
      headerButtons={
        <Authorized action="create" subject="PersonNode">
          <Link from="/people" to="create">
            <Button icon={<PlusOutlined />} size="large">
              Add Person
            </Button>
          </Link>
          <UploadPersonButton />
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
            defaultSortOrder: getDefaultSortOrder("name", sorters),
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
    </List>
  );
}

export const Route = createFileRoute("/people/")({
  component: withAuthorized("list", "PersonNode")(<ListPeoplePage />),
});

import { BarsOutlined, PlusOutlined } from "@ant-design/icons";
import { EditButton, List, SaveButton } from "@refinedev/antd";
import type { CrudFilter } from "@refinedev/core";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  SolicitationCodeTag,
  solicitationCodeTagColors,
  stringifySolicitationCodeTag,
} from "@ukdanceblue/common";
import { Button, Form, Input, Select, Space, Table, Tag } from "antd";
import type { DefaultOptionType } from "antd/es/select";
import { useState } from "react";

import { useMarathon } from "#config/marathonContext.ts";
import { PaginationFragment } from "#documents/shared.ts";
import { RefineSearchForm } from "#elements/components/RefineSearchForm.tsx";
import { TeamSelect } from "#elements/components/team/TeamSelect.tsx";
import { graphql, readFragment } from "#gql/index.ts";
import { useTypedForm, useTypedTable } from "#hooks/useTypedRefine.ts";

const SolicitationCodeTableFragment = graphql(/* GraphQL */ `
  fragment SolicitationCodeTableFragment on SolicitationCodeNode {
    id
    name
    text
    prefix
    code
    tags
    teams {
      id
      name
      marathon {
        id
        year
      }
    }
  }
`);

const SetSolicitationCodeDocument = graphql(
  /* GraphQL */ `
    mutation SetSolicitationCode(
      $input: SetSolicitationCodeInput!
      $id: GlobalId!
    ) {
      setSolicitationCode(id: $id, input: $input) {
        ...SolicitationCodeTableFragment
      }
    }
  `,
  [SolicitationCodeTableFragment]
);

const SolicitationCodeDocument = graphql(
  /* GraphQL */ `
    query SolicitationCodeDocument($id: GlobalId!) {
      solicitationCode(id: $id) {
        ...SolicitationCodeTableFragment
      }
    }
  `,
  [SolicitationCodeTableFragment]
);

const SolicitationCodeTableDocument = graphql(
  /* GraphQL */ `
    query SolicitationCodeTable(
      $search: SolicitationCodeResolverSearchFilter
      $filters: SolicitationCodeResolverFilterGroup
      $sortBy: [SolicitationCodeResolverSort!]
      $page: PositiveInt
      $pageSize: NonNegativeInt
    ) {
      solicitationCodes(
        search: $search
        filters: $filters
        sortBy: $sortBy
        page: $page
        pageSize: $pageSize
      ) {
        data {
          ...SolicitationCodeTableFragment
        }
        ...PaginationFragment
      }
    }
  `,
  [SolicitationCodeTableFragment, PaginationFragment]
);

export const Route = createFileRoute("/fundraising/solicitation-code/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id: marathonId, year: marathonYear } = useMarathon() ?? {};

  const { tableProps, sorters, searchFormProps } = useTypedTable({
    fragment: SolicitationCodeTableFragment,
    gqlQuery: SolicitationCodeTableDocument,
    props: {
      onSearch(data) {
        const filters: CrudFilter[] = [];
        for (const [key, value] of Object.entries(data)) {
          filters.push({
            field: key,
            operator: "contains",
            value: String(value),
          });
        }
        return filters;
      },
      resource: "solicitationCode",
    },
    fieldTypes: {
      tags: ["tags", "array", "every", "one"],
    },
  });

  const [editId, setEditId] = useState<string | null>(null);
  const { formProps, saveButtonProps, formLoading, onFinish } = useTypedForm<
    typeof SetSolicitationCodeDocument,
    {
      id: string;
      name: string | null;
      text: string;
      tags: SolicitationCodeTag[];
      teams: {
        label: string;
        value: string;
      }[];
    }
  >({
    mutation: SetSolicitationCodeDocument,
    dataToForm(data) {
      const fragmentData = readFragment(SolicitationCodeTableFragment, data);
      return {
        id: fragmentData.id,
        name: fragmentData.name,
        text: fragmentData.text,
        tags: fragmentData.tags,
        teams: fragmentData.teams.map(({ id, name, marathon: { year } }) => ({
          label: `${name} (${year})`,
          value: id,
        })),
      };
    },
    formToVariables(form) {
      return {
        name: form.name,
        tags: form.tags,
        teamIds: form.teams.map(({ value }) => value),
      };
    },
    props: {
      action: "edit",
      resource: "solicitationCode",
      id: editId!,
      queryOptions: {
        enabled: Boolean(editId),
      },
      meta: {
        gqlQuery: SolicitationCodeDocument,
      },
      redirect: false,
      onMutationSuccess(_data, _variables, _context, isAutoSave) {
        if (!isAutoSave) {
          setEditId(null);
        }
      },
    },
  });

  return (
    <List
      headerButtons={
        <Link to="/fundraising/solicitation-code/create">
          <Button icon={<PlusOutlined />} size="large">
            Create Solicitation Code
          </Button>
        </Link>
      }
    >
      <RefineSearchForm searchFormProps={searchFormProps} />
      <Form {...formProps} onFinish={onFinish}>
        <Table
          {...tableProps}
          rowKey="id"
          onRow={(record) => ({
            onClick: (event) => {
              if ((event.target as HTMLElement).nodeName === "TD") {
                setEditId(record.id);
              }
            },
          })}
          columns={[
            {
              title: "Solicitation Code",
              dataIndex: "text",
              key: "text",
              width: "50%",
              sorter: true,
              sortOrder:
                sorters.find((sorter) => sorter.field === "text")?.order ===
                "asc"
                  ? "ascend"
                  : "descend",
              render(_, record) {
                if (editId === record.id) {
                  return (
                    <Form.Item name="name" style={{ margin: 0 }}>
                      <Input
                        prefix={`${record.prefix}${record.code}`}
                        disabled={formLoading}
                      />
                    </Form.Item>
                  );
                } else {
                  return record.text;
                }
              },
            },
            {
              title: "Tags",
              dataIndex: "tags",
              key: "tags",
              width: "25%",
              filters: Object.values(SolicitationCodeTag).map((value) => ({
                text: stringifySolicitationCodeTag(value),
                value,
              })),
              render(_, record) {
                if (editId === record.id) {
                  return (
                    <Form.Item name="tags" style={{ margin: 0 }}>
                      <Select
                        tagRender={({ label, value, closable, onClose }) => (
                          <Tag
                            color={
                              solicitationCodeTagColors[
                                value as SolicitationCodeTag
                              ]
                            }
                            closable={closable}
                            onClose={onClose}
                          >
                            {label}
                          </Tag>
                        )}
                        mode="tags"
                        options={Object.values(SolicitationCodeTag).map(
                          (value): DefaultOptionType => ({
                            value,
                            label: stringifySolicitationCodeTag(value),
                          })
                        )}
                        style={{
                          width: "100%",
                        }}
                        loading={formLoading}
                        disabled={formLoading}
                      />
                    </Form.Item>
                  );
                } else {
                  return record.tags.map((tag) => (
                    <Tag
                      key={tag}
                      color={
                        solicitationCodeTagColors[tag as SolicitationCodeTag]
                      }
                    >
                      {stringifySolicitationCodeTag(tag)}
                    </Tag>
                  ));
                }
              },
            },
            {
              title: "Teams",
              dataIndex: "teams",
              key: "teams",
              width: "25%",
              render(_, record) {
                if (editId === record.id) {
                  return (
                    <Form.Item name="teams" style={{ margin: 0 }}>
                      <TeamSelect
                        marathonYear={marathonYear}
                        mode="tags"
                        loading={formLoading}
                        disabled={formLoading}
                      />
                    </Form.Item>
                  );
                } else {
                  return record.teams
                    .filter(
                      ({ marathon: { id } }) => !marathonId || id === marathonId
                    )
                    .map(({ name }) => name)
                    .join(", ");
                }
              },
            },
            {
              title: "Actions",
              key: "actions",
              render: (_, record) => {
                if (editId === record.id) {
                  return (
                    <Space>
                      <SaveButton {...saveButtonProps} hideText size="small" />
                      <Button onClick={() => setEditId(null)} size="small">
                        Cancel
                      </Button>
                    </Space>
                  );
                }
                return (
                  <Space>
                    <EditButton
                      onClick={() => setEditId(record.id)}
                      hideText
                      size="small"
                    />
                    <Link
                      to="/fundraising/solicitation-code/$solicitationCodeId"
                      params={{ solicitationCodeId: record.id }}
                    >
                      <Button icon={<BarsOutlined />} size="small" />
                    </Link>
                  </Space>
                );
              },
            },
          ]}
        />
      </Form>
    </List>
  );
}

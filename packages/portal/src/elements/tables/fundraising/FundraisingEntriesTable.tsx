import { FilterFilled } from "@ant-design/icons";
import { SortDirection } from "@ukdanceblue/common";
import { Button, Empty, Form, InputNumber, Select, Table } from "antd";
import { useForm } from "antd/es/form/Form.js";
import { DateTime } from "luxon";
import { useEffect } from "react";
import { useMutation } from "urql";

import type { FragmentType } from "@/graphql/index.js";
import { getFragmentData, graphql } from "@/graphql/index.js";
import type { UseListQueryHookReturn } from "@/hooks/useListQuery";
import { useMakeStringSearchFilterProps } from "@/hooks/useMakeSearchFilterProps.js";
import { useQueryStatusWatcher } from "@/hooks/useQueryStatusWatcher.js";

const AddFundraisingAssignmentDocument = graphql(/* GraphQL */ `
  mutation AddFundraisingAssignment(
    $entryId: GlobalId!
    $personId: GlobalId!
    $amount: Float!
  ) {
    assignEntryToPerson(
      entryId: $entryId
      personId: $personId
      input: { amount: $amount }
    ) {
      id
    }
  }
`);

const UpdateFundraisingAssignmentDocument = graphql(/* GraphQL */ `
  mutation UpdateFundraisingAssignment($id: GlobalId!, $amount: Float!) {
    updateFundraisingAssignment(id: $id, input: { amount: $amount }) {
      id
      amount
      person {
        name
      }
    }
  }
`);

const DeleteFundraisingAssignmentDocument = graphql(/* GraphQL */ `
  mutation DeleteFundraisingAssignment($id: GlobalId!) {
    deleteFundraisingAssignment(id: $id) {
      id
    }
  }
`);

export const FundraisingEntryTableFragment = graphql(/* GraphQL */ `
  fragment FundraisingEntryTableFragment on ListFundraisingEntriesResponse {
    data {
      id
      amount
      amountUnassigned
      donatedByText
      donatedToText
      donatedOn
      solicitationCode {
        code
        name
        prefix
      }
      assignments {
        id
        amount
        person {
          id
          name
          linkblue
        }
      }
    }
    page
    pageSize
    total
  }
`);

export function FundraisingEntriesTable({
  form: {
    queryOptions,
    updatePagination,
    clearSorting,
    pushSorting,
    updateFilter,
    clearFilter,
  },
  data,
  loading,
  refresh,
  potentialAssignees,
  showSolicitationCode = false,
}: {
  form: UseListQueryHookReturn<
    | "donatedOn"
    | "createdAt"
    | "updatedAt"
    | "amount"
    | "amountUnassigned"
    | "teamId"
    | "donatedTo"
    | "solicitationCode"
    | "donatedBy",
    "donatedOn" | "createdAt" | "updatedAt",
    "amount" | "amountUnassigned",
    "donatedTo" | "donatedBy" | "solicitationCode",
    "teamId",
    never,
    never
  >;
  data?: FragmentType<typeof FundraisingEntryTableFragment>;
  loading: boolean;
  refresh: () => void;
  potentialAssignees?: { value: string; label: string }[];
  showSolicitationCode?: boolean;
}) {
  const [addFundraisingAssignmentState, addFundraisingAssignment] = useMutation(
    AddFundraisingAssignmentDocument
  );
  useQueryStatusWatcher(addFundraisingAssignmentState);
  const [updateFundraisingAssignmentState, updateFundraisingAssignment] =
    useMutation(UpdateFundraisingAssignmentDocument);
  useQueryStatusWatcher(updateFundraisingAssignmentState);
  const [deleteFundraisingAssignmentState, deleteFundraisingAssignment] =
    useMutation(DeleteFundraisingAssignmentDocument);
  useQueryStatusWatcher(deleteFundraisingAssignmentState);

  const donatedByStringFilterProps = useMakeStringSearchFilterProps(
    "donatedBy",
    updateFilter,
    clearFilter
  );
  const donatedToStringFilterProps = useMakeStringSearchFilterProps(
    "donatedTo",
    updateFilter,
    clearFilter
  );
  const solicitationCodeStringFilterProps = useMakeStringSearchFilterProps(
    "solicitationCode",
    updateFilter,
    clearFilter
  );

  const fragmentData = getFragmentData(FundraisingEntryTableFragment, data);

  return (
    <Table
      style={{ width: "100%" }}
      dataSource={fragmentData?.data ?? undefined}
      rowKey={({ id }) => id}
      loading={loading}
      pagination={
        fragmentData?.data
          ? {
              current: fragmentData.page,
              pageSize: fragmentData.pageSize,
              total: fragmentData.total,
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
          let { field } = sort;
          const { order } = sort;

          if (!order) {
            continue;
          }

          if (field === "donatedToText") {
            field = "donatedTo";
          } else if (field === "donatedByText") {
            field = "donatedBy";
          }
          pushSorting({
            field: field as
              | "teamId"
              | "donatedOn"
              | "amount"
              | "donatedTo"
              | "donatedBy"
              | "createdAt"
              | "updatedAt",
            direction:
              order === "ascend" ? SortDirection.asc : SortDirection.desc,
          });
        }
      }}
      columns={[
        {
          title: "Donated By",
          dataIndex: "donatedByText",
          key: "donatedByText",
          sorter: true,
          ...donatedByStringFilterProps,
        },
        {
          title: "Donated To",
          dataIndex: "donatedToText",
          key: "donatedToText",
          sorter: true,
          ...donatedToStringFilterProps,
        },
        {
          title: "Donated On",
          dataIndex: "donatedOn",
          key: "donatedOn",
          sorter: true,
          render: (date: string) => DateTime.fromISO(date).toLocaleString(),
        },
        {
          title: "Amount",
          dataIndex: "amount",
          key: "amount",
          sorter: true,
          filterIcon() {
            return (
              <FilterFilled
                style={{
                  color:
                    queryOptions.numericFilters.find(
                      ({ field }) => field === "amount"
                    )?.value != null
                      ? "#1890ff"
                      : undefined,
                }}
              />
            );
          },
          filterDropdown: () => (
            <div
              style={{
                padding: 8,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <InputNumber
                addonBefore=">"
                onChange={(value) => {
                  if (value == null) {
                    clearFilter("amount");
                  } else {
                    const numericValue = Number.parseFloat(value.toString());
                    if (Number.isNaN(numericValue)) {
                      return;
                    }
                    updateFilter("amount", {
                      field: "amount",
                      value: numericValue,
                      comparison: "GREATER_THAN",
                    });
                  }
                }}
              />
              <InputNumber
                addonBefore="≤"
                onChange={(value) => {
                  if (value == null) {
                    clearFilter("amount");
                  } else {
                    const numericValue = Number.parseFloat(value.toString());
                    if (Number.isNaN(numericValue)) {
                      return;
                    }
                    updateFilter("amount", {
                      field: "amount",
                      value: numericValue,
                      comparison: "LESS_THAN_OR_EQUAL_TO",
                    });
                  }
                }}
              />
            </div>
          ),
        },
        Table.EXPAND_COLUMN,
        {
          title: "Amount Unassigned",
          dataIndex: "amountUnassigned",
          key: "amountUnassigned",
          sorter: true,
          filterIcon() {
            return (
              <FilterFilled
                style={{
                  color:
                    queryOptions.numericFilters.find(
                      ({ field }) => field === "amountUnassigned"
                    )?.value != null
                      ? "#1890ff"
                      : undefined,
                }}
              />
            );
          },
          filterDropdown: () => (
            <div
              style={{
                padding: 8,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <InputNumber
                addonBefore=">"
                onChange={(value) => {
                  if (value == null) {
                    clearFilter("amountUnassigned");
                  } else {
                    const numericValue = Number.parseFloat(value.toString());
                    if (Number.isNaN(numericValue)) {
                      return;
                    }
                    updateFilter("amountUnassigned", {
                      field: "amountUnassigned",
                      value: numericValue,
                      comparison: "GREATER_THAN",
                    });
                  }
                }}
              />
              <InputNumber
                addonBefore="≤"
                onChange={(value) => {
                  if (value == null) {
                    clearFilter("amountUnassigned");
                  } else {
                    const numericValue = Number.parseFloat(value.toString());
                    if (Number.isNaN(numericValue)) {
                      return;
                    }
                    updateFilter("amountUnassigned", {
                      field: "amountUnassigned",
                      value: numericValue,
                      comparison: "LESS_THAN_OR_EQUAL_TO",
                    });
                  }
                }}
              />
            </div>
          ),
        },
        // TODO: replace with a picker to select a new solicitation code
        {
          hidden: !showSolicitationCode,
          title: "Solicitation Code",
          dataIndex: "solicitationCode",
          key: "solicitationCode",
          sorter: true,
          ...solicitationCodeStringFilterProps,
          render: (
            solicitationCode: {
              prefix: string;
              code: string;
              name: string | null;
            } | null
          ) =>
            solicitationCode
              ? solicitationCode.name
                ? `${solicitationCode.prefix}${solicitationCode.code} - ${solicitationCode.name}`
                : `${solicitationCode.prefix}${solicitationCode.code}`
              : null,
        },
      ]}
      expandable={{
        rowExpandable: () => true,
        expandedRowRender: ({ assignments, id, amountUnassigned }) => (
          <Table
            dataSource={assignments}
            pagination={false}
            locale={{
              emptyText: (
                <Empty
                  description="No Assignments"
                  image={null}
                  imageStyle={{ height: 0, margin: 0 }}
                />
              ),
            }}
            footer={() =>
              potentialAssignees && (
                <FundraisingTableNewAssignment
                  addFundraisingAssignment={addFundraisingAssignment}
                  refresh={refresh}
                  amountUnassigned={amountUnassigned}
                  id={id}
                  members={potentialAssignees}
                  loading={
                    addFundraisingAssignmentState.fetching ||
                    updateFundraisingAssignmentState.fetching
                  }
                />
              )
            }
            columns={[
              {
                title: "Person",
                dataIndex: ["person"],
                render: ({
                  id,
                  name,
                  linkblue,
                }: {
                  id: string;
                  name?: string;
                  linkblue?: string;
                }) => name ?? (linkblue ? <i>{linkblue}</i> : <pre>{id}</pre>),
                key: "person",
                width: "60%",
              },
              {
                title: "Amount",
                dataIndex: "amount",
                key: "amount",
                width: "40%",
                render: (amount: number, { id }: { id: string }) => (
                  <Form
                    layout="inline"
                    onFinish={(values: { amount: number }) => {
                      updateFundraisingAssignment({
                        id,
                        amount: values.amount,
                      })
                        .then(() => {
                          refresh();
                        })
                        .catch(() => {
                          alert(
                            "An error occurred while updating the assignment."
                          );
                        });
                    }}
                    initialValues={{ amount }}
                    style={{ display: "flex", gap: 8 }}
                  >
                    <Form.Item name="amount">
                      <InputNumber prefix="$" />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={
                          addFundraisingAssignmentState.fetching ||
                          updateFundraisingAssignmentState.fetching
                        }
                      >
                        Update
                      </Button>
                    </Form.Item>
                  </Form>
                ),
              },
              {
                title: "Actions",
                key: "actions",
                render: (_, { id }: { id: string }) => (
                  <Button
                    type="primary"
                    danger
                    onClick={() => {
                      if (
                        confirm(
                          "Are you sure you want to delete this assignment?"
                        )
                      ) {
                        deleteFundraisingAssignment({ id })
                          .then(() => {
                            refresh();
                          })
                          .catch(() => {
                            alert(
                              "An error occurred while deleting the assignment."
                            );
                          });
                      }
                    }}
                    loading={deleteFundraisingAssignmentState.fetching}
                  >
                    Delete
                  </Button>
                ),
              },
            ]}
          />
        ),
      }}
    />
  );
}

function FundraisingTableNewAssignment({
  addFundraisingAssignment,
  amountUnassigned,
  members,
  id,
  refresh,
  loading,
}: {
  addFundraisingAssignment: ({
    entryId,
    personId,
    amount,
  }: {
    entryId: string;
    personId: string;
    amount: number;
  }) => Promise<unknown>;
  refresh: () => void;
  amountUnassigned: number;
  id: string;
  members: { label: string; value: string }[];
  loading: boolean;
}) {
  const [form] = useForm<{
    personId: string;
    amount: number;
  }>();

  useEffect(() => {
    form.setFieldsValue({ amount: amountUnassigned });
  }, [amountUnassigned, form]);

  return (
    <Form
      form={form}
      layout="inline"
      onFinish={(values: { personId: string; amount: number }) => {
        addFundraisingAssignment({
          entryId: id,
          personId: values.personId,
          amount: values.amount,
        })
          .then(() => {
            refresh();
            form.resetFields(["personId"]);
          })
          .catch(() => {
            alert("An error occurred while adding the assignment.");
          });
      }}
      initialValues={{ amount: amountUnassigned }}
      style={{ display: "flex", gap: 8 }}
    >
      <Form.Item
        label="Person"
        name="personId"
        rules={[{ required: true, message: "Person is required" }]}
        style={{ flex: 4 }}
      >
        <Select options={members} />
      </Form.Item>
      <Form.Item
        name="amount"
        rules={[{ required: true, message: "Amount is required" }]}
        style={{ flex: 1 }}
      >
        <InputNumber prefix="$" />
      </Form.Item>
      <Form.Item style={{ flex: 1 }}>
        <Button type="primary" htmlType="submit" loading={loading}>
          Add Assignment
        </Button>
      </Form.Item>
    </Form>
  );
}

import { Button, Empty, Form, InputNumber, Select, Table } from "antd";
import { useForm } from "antd/es/form/Form.js";
import { useEffect } from "react";
import { useMutation } from "urql";

import type { FragmentOf } from "#graphql/index.js";
import { graphql, readFragment } from "#graphql/index.js";
import { useQueryStatusWatcher } from "#hooks/useQueryStatusWatcher.js";

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

export const FundraisingEntryAssignmentTableFragment = graphql(/* GraphQL */ `
  fragment FundraisingEntryAssignmentTableFragment on FundraisingEntryNode {
    id
    amount
    amountUnassigned
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
`);

export function FundraisingAssignmentsTable({
  fragment,
  potentialAssignees,
  refresh,
}: {
  fragment:
    | FragmentOf<typeof FundraisingEntryAssignmentTableFragment>
    | undefined;
  potentialAssignees?: { value: string; label: string }[] | undefined;
  refresh?: () => void;
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

  const { id, assignments, amountUnassigned } =
    readFragment(FundraisingEntryAssignmentTableFragment, fragment) ?? {};

  return (
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
      loading={!fragment}
      footer={() =>
        potentialAssignees && (
          <FundraisingTableNewAssignment
            addFundraisingAssignment={addFundraisingAssignment}
            refresh={refresh}
            amountUnassigned={amountUnassigned}
            id={id}
            members={potentialAssignees}
            loading={
              !fragment ||
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
                    refresh?.();
                  })
                  .catch(() => {
                    alert("An error occurred while updating the assignment.");
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
                  confirm("Are you sure you want to delete this assignment?")
                ) {
                  deleteFundraisingAssignment({ id })
                    .then(() => {
                      refresh?.();
                    })
                    .catch(() => {
                      alert("An error occurred while deleting the assignment.");
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
  refresh?: () => void;
  amountUnassigned: number | undefined;
  id: string | undefined;
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
        if (!id) {
          alert("An error occurred while adding the assignment.");
          return;
        }

        addFundraisingAssignment({
          entryId: id,
          personId: values.personId,
          amount: values.amount,
        })
          .then(() => {
            refresh?.();
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

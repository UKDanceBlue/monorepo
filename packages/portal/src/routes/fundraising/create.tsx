import { DollarOutlined } from "@ant-design/icons";
import { Create } from "@refinedev/antd";
import { createFileRoute } from "@tanstack/react-router";
import {
  BatchType,
  type CreateFundraisingEntryInput,
  localDateFromLuxon,
  stringifyDDNBatchType,
} from "@ukdanceblue/common";
import { Form, Input, InputNumber, Select } from "antd";
import type { DateTime } from "luxon";

import { LuxonDatePicker } from "#elements/components/antLuxonComponents.tsx";
import { graphql } from "#gql/index.ts";
import { useTypedForm, useTypedSelect } from "#hooks/useTypedRefine.ts";

export const Route = createFileRoute("/fundraising/create")({
  component: RouteComponent,
});

const solicitationCodeFragment = graphql(/* GraphQL */ `
  fragment SolicitationCodeFragment on SolicitationCodeNode {
    id
    text
  }
`);

const CreateFundraisingEntryDocument = graphql(/* GraphQL */ `
  mutation CreateFundraisingEntry($input: CreateFundraisingEntryInput!) {
    createFundraisingEntry(input: $input) {
      id
    }
  }
`);

function RouteComponent() {
  const { formProps, saveButtonProps } = useTypedForm({
    mutation: CreateFundraisingEntryDocument,
    props: {
      resource: "fundraisingEntry",
      action: "create",
    },
  });

  const { selectProps } = useTypedSelect({
    fragment: solicitationCodeFragment,
    props: {
      resource: "solicitationCode",
      optionValue: "id",
      optionLabel: "text",
      pagination: {
        mode: "off",
      },
    },
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form
        {...formProps}
        layout="vertical"
        onFinish={(data) => {
          formProps.onFinish?.({
            amount: data.amount,
            donatedBy: data.donatedBy ?? undefined,
            donatedTo: data.donatedTo ?? undefined,
            notes: data.notes ?? undefined,
            solicitationCodeId: data.solicitationCodeId,
            batchType: data.batchType,
            donatedOn: data.donatedOn
              ? localDateFromLuxon(data.donatedOn as unknown as DateTime)
              : undefined,
          } satisfies Omit<
            CreateFundraisingEntryInput,
            "solicitationCodeId"
          > & {
            solicitationCodeId: string | undefined;
          });
        }}
      >
        <Form.Item
          label="Amount"
          name="amount"
          required
          rules={[
            {
              message: "Amount must be a valid dollar amount",
              validator(_, value: number) {
                if (
                  value % 1 !== 0 &&
                  value.toString().split(".")[1]!.length > 2
                ) {
                  return Promise.reject(
                    new Error("Amount must be a valid dollar amount")
                  );
                }
                return Promise.resolve();
              },
            },
            { required: true },
          ]}
        >
          <InputNumber
            prefix={<DollarOutlined />}
            style={{
              width: "100%",
            }}
          />
        </Form.Item>
        <Form.Item label="Donated By" name="donatedBy">
          <Input />
        </Form.Item>
        <Form.Item label="Donated To" name="donatedTo">
          <Input />
        </Form.Item>
        <Form.Item label="Notes" name="notes">
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          label="Solicitation Code"
          name="solicitationCodeId"
          rules={[{ required: true }]}
        >
          <Select
            {...selectProps}
            onSearch={undefined}
            filterOption={true}
            optionFilterProp="label"
          />
        </Form.Item>
        <Form.Item
          label="Batch Type"
          name="batchType"
          rules={[{ required: true }]}
        >
          <Select
            options={Object.values(BatchType).map((val) => ({
              label: stringifyDDNBatchType(val),
              value: val,
            }))}
          />
        </Form.Item>
        <Form.Item label="Donated On" name="donatedOn">
          <LuxonDatePicker style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Create>
  );
}

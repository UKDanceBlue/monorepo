import { DollarOutlined } from "@ant-design/icons";
import { Create } from "@refinedev/antd";
import { createFileRoute } from "@tanstack/react-router";
import {
  BatchType,
  localDateFromLuxon,
  stringifyDDNBatchType,
} from "@ukdanceblue/common";
import { Form, Input, InputNumber, Select } from "antd";
import { DateTime } from "luxon";

import { LuxonDatePicker } from "#elements/components/antLuxonComponents.js";
import { graphql } from "#gql/index.js";
import { useTypedForm } from "#hooks/refine/form.tsx";
import { useTypedSelect } from "#hooks/refine/select.tsx";

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
      amount
      donatedByText
      donatedToText
      notes
      solicitationCode {
        id
      }
      batchType
      donatedOn
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
    dataToForm(data): {
      amount: number;
      donatedBy: string | null | undefined;
      donatedTo: string | null | undefined;
      notes: string | null | undefined;
      solicitationCodeId: string | undefined;
      batchType: BatchType;
      donatedOn: DateTime | null | undefined;
    } {
      return {
        amount: data.amount,
        donatedBy: data.donatedByText,
        donatedTo: data.donatedToText,
        notes: data.notes,
        solicitationCodeId: data.solicitationCode.id,
        batchType: data.batchType,
        donatedOn: data.donatedOn
          ? DateTime.fromISO(data.donatedOn)
          : undefined,
      };
    },
    formToVariables(formData) {
      return {
        amount: formData.amount,
        donatedBy: formData.donatedBy ?? null,
        donatedTo: formData.donatedTo ?? null,
        notes: formData.notes ?? null,
        solicitationCodeId: formData.solicitationCodeId!,
        batchType: formData.batchType,
        donatedOn: formData.donatedOn
          ? localDateFromLuxon(formData.donatedOn)
          : undefined,
      };
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
      <Form {...formProps} layout="vertical">
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

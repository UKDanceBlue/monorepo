import { Edit, useForm, useSelect } from "@refinedev/antd";
import type { HttpError } from "@refinedev/core";
import { Form, Input, InputNumber, Select } from "antd";
import { readFragment, type ResultOf, type VariablesOf } from "gql.tada";
import { DateTime } from "luxon";

import {
  FundraisingEntryEditorFragment,
  getFundraisingEntryDocument,
  setFundraisingEntryDocument,
} from "#documents/fundraisingEntry.ts";
import {
  solicitationCodesDocument,
  SolicitationCodeTextFragment,
} from "#documents/solicitationCode.ts";
import { LuxonDatePicker } from "#elements/components/antLuxonComponents.tsx";

export function FundraisingEntryEditor({ id }: { id: string }) {
  const { formProps, saveButtonProps } = useForm<
    ResultOf<typeof getFundraisingEntryDocument>["fundraisingEntry"],
    HttpError,
    VariablesOf<typeof getFundraisingEntryDocument> &
      VariablesOf<typeof setFundraisingEntryDocument>,
    Omit<
      ResultOf<typeof FundraisingEntryEditorFragment>,
      "donatedOn" | "donatedOnOverride"
    > & {
      donatedOn: DateTime;
      donatedOnOverride: DateTime | undefined;
    },
    ResultOf<typeof setFundraisingEntryDocument>["setFundraisingEntry"]
  >({
    id,
    resource: "fundraisingEntry",
    meta: {
      gqlQuery: getFundraisingEntryDocument,
      gqlMutation: setFundraisingEntryDocument,
    },
    action: "edit",
    queryOptions: {
      select: ({ data }) => {
        const fragmentData = readFragment(FundraisingEntryEditorFragment, data);
        return {
          data: {
            ...fragmentData,
            donatedOn: DateTime.fromISO(fragmentData.donatedOn),
            donatedOnOverride: fragmentData.donatedOnOverride
              ? DateTime.fromISO(fragmentData.donatedOnOverride)
              : undefined,
          },
        };
      },
    },
  });

  const { selectProps } = useSelect<
    ResultOf<typeof solicitationCodesDocument>["solicitationCodes"][number],
    HttpError,
    ResultOf<typeof SolicitationCodeTextFragment>
  >({
    resource: "solicitationCode",
    meta: {
      gqlQuery: solicitationCodesDocument,
    },
    queryOptions: {
      select: ({ data, total }) => {
        return {
          data: [...readFragment(SolicitationCodeTextFragment, data)],
          total,
        };
      },
    },
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="horizontal">
        <Form.Item label="Donated On" name="donatedOn">
          <LuxonDatePicker variant="borderless" readOnly disabled />
        </Form.Item>
        <Form.Item label="Donated On Override" name="donatedOnOverride">
          <LuxonDatePicker />
        </Form.Item>
        <Form.Item label="Amount" name="amount">
          <InputNumber
            readOnly
            disabled
            prefix="$"
            min={0}
            precision={2}
            variant="borderless"
          />
        </Form.Item>
        <Form.Item label="Amount Override" name="amountOverride">
          <InputNumber prefix="$" min={0} precision={2} />
        </Form.Item>
        <Form.Item label="Notes" name="notes">
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="Solicitation Code" name="solicitationCode.text">
          <Input readOnly disabled variant="borderless" />
        </Form.Item>
        <Form.Item
          label="Solicitation Code Override"
          name="solicitationCodeOverride.id"
        >
          <Select {...selectProps} />
        </Form.Item>
        <Form.Item label="Batch Type" name="batchType">
          <Input readOnly disabled variant="borderless" />
        </Form.Item>
        <Form.Item label="Batch Type Override" name="batchTypeOverride">
          <Input />
        </Form.Item>
        <Form.Item label="Donated By" name="donatedByText">
          <Input readOnly disabled variant="borderless" />
        </Form.Item>
        <Form.Item label="Donated By Override" name="donatedByOverride">
          <Input />
        </Form.Item>
        <Form.Item label="Donated To" name="donatedToText">
          <Input readOnly disabled variant="borderless" />
        </Form.Item>
        <Form.Item label="Donated To Override" name="donatedToOverride">
          <Input />
        </Form.Item>
      </Form>
    </Edit>
  );
}

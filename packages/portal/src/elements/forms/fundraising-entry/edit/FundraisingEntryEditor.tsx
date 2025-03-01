import { Edit, useForm, useSelect } from "@refinedev/antd";
import { type HttpError, useRefreshButton } from "@refinedev/core";
import { Link } from "@tanstack/react-router";
import type { SetFundraisingEntryInput } from "@ukdanceblue/common";
import {
  BatchType,
  FundraisingEntrySource,
  localDateFromLuxon,
  stringifyDDNBatchType,
} from "@ukdanceblue/common";
import { Form, Input, InputNumber, Select } from "antd";
import { readFragment, type ResultOf, type VariablesOf } from "gql.tada";
import { DateTime } from "luxon";
import { useEffect } from "react";

import {
  FundraisingEntryEditorFragment,
  getFundraisingEntryDocument,
  setFundraisingEntryDocument,
} from "#documents/fundraisingEntry.js";
import { SolicitationCodeTextFragment } from "#documents/solicitationCode.js";
import { LuxonDatePicker } from "#elements/components/antLuxonComponents.js";
import { FundraisingAssignmentsTable } from "#elements/tables/fundraising/FundraisingEntryAssignmentsTable.js";
import { useAuthorizationRequirement } from "#hooks/useLoginState.js";

export function FundraisingEntryEditor({ id }: { id: string }) {
  const { formProps, saveButtonProps, query } = useForm<
    NonNullable<
      ResultOf<typeof getFundraisingEntryDocument>["fundraisingEntry"]
    >,
    HttpError,
    VariablesOf<typeof setFundraisingEntryDocument>["input"],
    Omit<
      ResultOf<typeof FundraisingEntryEditorFragment>,
      "donatedOn" | "donatedOnOverride"
    > & {
      donatedOn: DateTime | undefined;
      donatedOnOverride: DateTime | undefined;
    },
    NonNullable<
      ResultOf<typeof setFundraisingEntryDocument>["setFundraisingEntry"]
    >
  >({
    redirect: "edit",
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
            donatedOn: fragmentData.donatedOn
              ? DateTime.fromISO(fragmentData.donatedOn)
              : undefined,
            donatedOnOverride: fragmentData.donatedOnOverride
              ? DateTime.fromISO(fragmentData.donatedOnOverride)
              : undefined,
            solicitationCodeOverrideId:
              fragmentData.solicitationCodeOverride?.id,
          },
        };
      },
    },
  });

  const queryResult = query?.data?.data;

  const { selectProps } = useSelect<
    ResultOf<typeof SolicitationCodeTextFragment>,
    HttpError,
    ResultOf<typeof SolicitationCodeTextFragment>
  >({
    resource: "solicitationCode",
    meta: {
      gqlFragment: SolicitationCodeTextFragment,
    },
    sorters: [
      {
        field: "name",
        order: "asc",
      },
      {
        field: "text",
        order: "asc",
      },
    ],
    optionLabel: "text",
    optionValue: "id",
  });

  // Stupid workaround for a bug that causes the form to ignore the first update
  useEffect(() => {
    formProps.onValuesChange?.({}, {});
  }, [formProps]);

  return (
    <Edit
      saveButtonProps={saveButtonProps}
      canDelete={useAuthorizationRequirement("delete", {
        kind: "FundraisingEntryNode",
      })}
    >
      <p>
        There is a known issue with the solicitation code override field. Once
        you type your search, the field will close itself but the search will
        still work. We're working on figuring out where this issue is coming
        from and we'll have a fix soon.
      </p>
      <Form
        {...formProps}
        layout="horizontal"
        onFinish={(data) => {
          formProps.onFinish?.({
            amountOverride: data.amountOverride ?? undefined,
            donatedByOverride: data.donatedByOverride || undefined,
            batchTypeOverride: data.batchTypeOverride ?? undefined,
            donatedOnOverride: data.donatedOnOverride
              ? localDateFromLuxon(
                  data.donatedOnOverride as unknown as DateTime
                )
              : undefined,
            donatedToOverride: data.donatedToOverride || undefined,
            notes: data.notes || undefined,
            solicitationCodeOverrideId:
              data.solicitationCodeOverrideId ?? undefined,
          } satisfies Omit<
            SetFundraisingEntryInput,
            "solicitationCodeOverrideId"
          > & {
            solicitationCodeOverrideId: string | undefined;
          });
        }}
      >
        <Form.Item
          label="Source"
          name={["source"]}
          extra={
            queryResult?.dailyDepartmentNotification && (
              <Link
                to="/fundraising/ddn/$ddnId"
                params={{ ddnId: queryResult.dailyDepartmentNotification.id }}
              >
                View
              </Link>
            )
          }
        >
          <Input readOnly disabled variant="borderless" />
        </Form.Item>

        <Form.Item
          label="Donated On"
          name={["donatedOn"]}
          extra={
            queryResult?.donatedOnOverride && (
              <i>Overridden, clear the override to see the original value</i>
            )
          }
        >
          <LuxonDatePicker variant="borderless" readOnly disabled />
        </Form.Item>
        <Form.Item label="Donated On Override" name={["donatedOnOverride"]}>
          <LuxonDatePicker defaultValue={queryResult?.donatedOnOverride} />
        </Form.Item>
        <Form.Item
          label="Amount"
          name={["amount"]}
          extra={
            queryResult?.amountOverride && (
              <i>Overridden, clear the override to see the original value</i>
            )
          }
        >
          <InputNumber
            readOnly
            disabled
            prefix="$"
            min={0}
            precision={2}
            variant="borderless"
          />
        </Form.Item>
        <Form.Item
          label="Amount Override"
          name={["amountOverride"]}
          rules={[
            {
              required: queryResult?.source === FundraisingEntrySource.Override,
              message: "Amount override is required when the entry is custom",
            },
          ]}
        >
          <InputNumber prefix="$" min={0} precision={2} />
        </Form.Item>
        <p>
          Note that setting an amount override will not alter the existing
          assignments of this fundraising entry. Decreasing the amount may
          result in negative numbers in the assignments.
        </p>
        <Form.Item label="Notes" name={["notes"]}>
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          label="Solicitation Code"
          name={["solicitationCode", "text"]}
          extra={
            queryResult?.solicitationCodeOverride && (
              <i>Overridden, clear the override to see the original value</i>
            )
          }
        >
          <Input readOnly disabled variant="borderless" />
        </Form.Item>
        <Form.Item
          label="Solicitation Code Override"
          name={["solicitationCodeOverrideId"]}
          rules={[
            {
              required: queryResult?.source === FundraisingEntrySource.Override,
              message:
                "Solicitation code override is required when the entry is custom",
            },
          ]}
        >
          <Select {...selectProps} allowClear />
        </Form.Item>
        <Form.Item
          label="Batch Type"
          name={["batchType"]}
          extra={
            queryResult?.batchTypeOverride && (
              <i>Overridden, clear the override to see the original value</i>
            )
          }
        >
          <Input readOnly disabled variant="borderless" />
        </Form.Item>
        <Form.Item
          label="Batch Type Override"
          name={["batchTypeOverride"]}
          rules={[
            {
              required: queryResult?.source === FundraisingEntrySource.Override,
              message:
                "Batch type override is required when the entry is custom",
            },
          ]}
        >
          <Select allowClear>
            {Object.values(BatchType).map((value) => (
              <Select.Option key={value} value={value}>
                {stringifyDDNBatchType(value)}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Donated By"
          name={["donatedByText"]}
          extra={
            queryResult?.donatedByOverride && (
              <i>Overridden, clear the override to see the original value</i>
            )
          }
        >
          <Input readOnly disabled variant="borderless" />
        </Form.Item>
        <Form.Item label="Donated By Override" name={["donatedByOverride"]}>
          <Input allowClear />
        </Form.Item>
        <Form.Item
          label="Donated To"
          name={["donatedToText"]}
          extra={
            queryResult?.donatedToOverride && (
              <i>Overridden, clear the override to see the original value</i>
            )
          }
        >
          <Input readOnly disabled variant="borderless" />
        </Form.Item>
        <Form.Item label="Donated To Override" name={["donatedToOverride"]}>
          <Input allowClear />
        </Form.Item>
      </Form>
      <FundraisingAssignmentsTable
        fragment={queryResult}
        refresh={
          useRefreshButton({
            resource: "fundraisingEntry",
            id,
          }).onClick
        }
      />
    </Edit>
  );
}

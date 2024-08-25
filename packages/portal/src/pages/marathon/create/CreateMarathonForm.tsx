import { LuxonDatePicker } from "@elements/components/antLuxonComponents";
import { TanAntForm } from "@elements/components/form/TanAntForm";
import type { TanAntChildInputProps } from "@elements/components/form/TanAntFormItem";
import { TanAntFormItem } from "@elements/components/form/TanAntFormItem";
import { Button, Form, Input } from "antd";
import { DateTime } from "luxon";

import { useMarathonCreatorForm } from "./useMarathonCreatorForm";

const MARATHON_YEAR_REGEX = /^DB\d{2}$/;

export const CreateMarathonForm = () => {
  const { formApi } = useMarathonCreatorForm();

  return (
    <TanAntForm handleSubmit={formApi.handleSubmit} layout="vertical">
      <TanAntFormItem
        formApi={formApi}
        name="year"
        label="Year"
        fieldProps={{
          validate: (value) => {
            if (!value) {
              return "Year is required";
            }

            if (!MARATHON_YEAR_REGEX.test(value)) {
              return "Year must be in the format DB__";
            }

            return undefined;
          },
        }}
      >
        {({
          onBlur,
          onChange,
          value,
          status,
        }: TanAntChildInputProps<string | undefined>) => (
          <Input
            status={status}
            name="year"
            value={value}
            onBlur={onBlur}
            onChange={(e) => onChange(e.target.value)}
            placeholder="DB22"
          />
        )}
      </TanAntFormItem>
      <TanAntFormItem
        formApi={formApi}
        name="startDate"
        label="Start Date"
        fieldProps={{
          validate: (value: DateTime | undefined) => {
            if (!value) {
              return "Start Date is required";
            }
            if (!value.isValid) {
              return value.invalidExplanation ?? "Invalid date";
            }
            return undefined;
          },
        }}
      >
        {({
          onBlur,
          onChange,
          value,
          status,
        }: TanAntChildInputProps<DateTime | undefined>) => (
          <LuxonDatePicker
            showTime
            showSecond={false}
            showMinute={false}
            showNow={false}
            status={status}
            name="startDate"
            value={value}
            onBlur={onBlur}
            onChange={(value) =>
              value.isValid
                ? onChange(value.set({ minute: 0, second: 0, millisecond: 0 }))
                : DateTime.invalid("Invalid date")
            }
          />
        )}
      </TanAntFormItem>
      <TanAntFormItem
        formApi={formApi}
        name="endDate"
        label="End Date"
        fieldProps={{
          validate: (value: DateTime | undefined) => {
            if (!value) {
              return "End Date is required";
            }
            if (!value.isValid) {
              return value.invalidExplanation ?? "Invalid date";
            }
            return undefined;
          },
        }}
      >
        {({
          onBlur,
          onChange,
          value,
          status,
        }: TanAntChildInputProps<DateTime | undefined>) => (
          <LuxonDatePicker
            showTime
            showSecond={false}
            showMinute={false}
            showNow={false}
            status={status}
            name="endDate"
            value={value}
            onBlur={onBlur}
            onChange={(value) =>
              value.isValid
                ? onChange(value.set({ minute: 0, second: 0, millisecond: 0 }))
                : DateTime.invalid("Invalid date")
            }
          />
        )}
      </TanAntFormItem>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Create Marathon
        </Button>
      </Form.Item>
    </TanAntForm>
  );
};

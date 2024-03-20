import { LuxonDatePicker } from "@elements/components/antLuxonComponents";
import { Button, Form, Input } from "antd";

import { useMarathonCreatorForm } from "./useMarathonCreatorForm";

const MARATHON_YEAR_REGEX = /^DB\d{2}$/;

export const CreateMarathonForm = () => {
  const { formApi } = useMarathonCreatorForm();

  return (
    <formApi.Provider>
      <Form
        layout="vertical"
        onFinish={() => {
          void formApi.handleSubmit();
        }}
      >
        <formApi.Field
          name="year"
          onChange={(value) => {
            if (!value) {
              return "Year is required";
            }

            if (!MARATHON_YEAR_REGEX.test(value)) {
              return "Year must be in the format DB__";
            }

            return undefined;
          }}
        >
          {(fieldApi) => (
            <Form.Item
              label="Year"
              validateStatus={
                fieldApi.state.meta.errors.length > 0 ? "error" : ""
              }
              help={
                fieldApi.state.meta.errors.length > 0
                  ? fieldApi.state.meta.errors[0]
                  : undefined
              }
            >
              <Input
                status={fieldApi.state.meta.errors.length > 0 ? "error" : ""}
                name={fieldApi.name}
                value={fieldApi.state.value}
                onBlur={fieldApi.handleBlur}
                onChange={(e) => fieldApi.handleChange(e.target.value)}
                placeholder="DB22"
              />
            </Form.Item>
          )}
        </formApi.Field>
        <formApi.Field
          name="startDate"
          onChange={(value) => {
            if (!value) {
              return "Start Date is required";
            }
            if (!value.isValid) {
              return value.invalidExplanation ?? "Invalid date";
            }
            return undefined;
          }}
        >
          {(fieldApi) => (
            <Form.Item
              label="Start Date"
              validateStatus={
                fieldApi.state.meta.errors.length > 0 ? "error" : ""
              }
              help={
                fieldApi.state.meta.errors.length > 0
                  ? fieldApi.state.meta.errors[0]
                  : undefined
              }
            >
              <LuxonDatePicker
                showTime
                showSecond={false}
                showMinute={false}
                showNow={false}
                status={fieldApi.state.meta.errors.length > 0 ? "error" : ""}
                name={fieldApi.name}
                value={fieldApi.state.value}
                onBlur={fieldApi.handleBlur}
                onChange={(value) =>
                  fieldApi.handleChange(
                    value?.set({ minute: 0, second: 0, millisecond: 0 }) ??
                      undefined
                  )
                }
              />
            </Form.Item>
          )}
        </formApi.Field>
        <formApi.Field
          name="endDate"
          onChange={(value) => {
            if (!value) {
              return "End Date is required";
            }
            if (!value.isValid) {
              return value.invalidExplanation ?? "Invalid date";
            }
            return undefined;
          }}
        >
          {(fieldApi) => (
            <Form.Item
              label="End Date"
              validateStatus={
                fieldApi.state.meta.errors.length > 0 ? "error" : ""
              }
              help={
                fieldApi.state.meta.errors.length > 0
                  ? fieldApi.state.meta.errors[0]
                  : undefined
              }
            >
              <LuxonDatePicker
                showTime
                showSecond={false}
                showMinute={false}
                showNow={false}
                status={fieldApi.state.meta.errors.length > 0 ? "error" : ""}
                name={fieldApi.name}
                value={fieldApi.state.value}
                onBlur={fieldApi.handleBlur}
                onChange={(value) =>
                  fieldApi.handleChange(
                    value?.set({ minute: 0, second: 0, millisecond: 0 }) ??
                      undefined
                  )
                }
              />
            </Form.Item>
          )}
        </formApi.Field>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Create Marathon
          </Button>
        </Form.Item>
      </Form>
    </formApi.Provider>
  );
};

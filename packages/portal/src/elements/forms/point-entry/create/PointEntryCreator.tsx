import { App, Button, Form, Input, InputNumber } from "antd";
import { useReducer } from "react";

import { PointEntryPersonLookup } from "./PointEntryPersonLookup";
import { usePointEntryCreatorForm } from "./usePointEntryCreatorForm";

export function PointEntryCreator({
  teamUuid,
  refetch,
}: {
  teamUuid: string;
  refetch: () => void;
}) {
  const { message } = App.useApp();

  const [personLookupKey, resetLookup] = useReducer(
    (prev: number) => prev + 1,
    0
  );
  const { formApi } = usePointEntryCreatorForm({
    teamUuid,
    onReset: () => {
      resetLookup();
      // Delay refetching a bit to allow the form to reset
      setTimeout(() => {
        refetch();
      }, 75);
    },
  });

  return (
    <formApi.Provider>
      <Form
        onFinish={() => {
          formApi.handleSubmit().catch((error) => {
            if (error instanceof Error) {
              void message.error(error.message);
            } else {
              void message.error("An unknown error occurred");
            }
          });
        }}
        wrapperCol={{ flex: 1 }}
        layout="vertical"
        labelWrap
      >
        <formApi.Field
          name="comment"
          children={(field) => (
            <Form.Item
              label="Comment"
              validateStatus={field.state.meta.errors.length > 0 ? "error" : ""}
              help={
                field.state.meta.errors.length > 0
                  ? field.state.meta.errors[0]
                  : undefined
              }
            >
              <Input
                status={field.state.meta.errors.length > 0 ? "error" : ""}
                name={field.name}
                value={field.state.value ?? undefined}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </Form.Item>
          )}
        />
        <formApi.Field
          name="points"
          onChange={(value) =>
            !value ? "A point value is required" : undefined
          }
          children={(field) => (
            <Form.Item
              label="Points*"
              validateStatus={field.state.meta.errors.length > 0 ? "error" : ""}
              help={
                field.state.meta.errors.length > 0
                  ? field.state.meta.errors[0]
                  : undefined
              }
            >
              <InputNumber
                status={field.state.meta.errors.length > 0 ? "error" : ""}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(num) => field.handleChange(num ?? 0)}
              />
            </Form.Item>
          )}
        />
        <PointEntryPersonLookup
          formApi={formApi}
          teamUuid={teamUuid}
          key={personLookupKey}
        />
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
    </formApi.Provider>
  );
}

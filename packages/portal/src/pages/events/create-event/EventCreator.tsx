import { PlusOutlined } from "@ant-design/icons";
import { App, Button, Form, Input, List } from "antd";
import { Interval } from "luxon";

import { EventOccurrencePicker } from "../../../elements/components/event/EventOccurrencePicker";

import { useEventCreatorForm } from "./useEventCreatorForm";

export function EventCreator() {
  const { message } = App.useApp();

  const { formApi } = useEventCreatorForm();

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
          name="title"
          onChange={(value) => (!value ? "Title is required" : undefined)}
          children={(field) => (
            <Form.Item
              label="Title*"
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
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </Form.Item>
          )}
        />
        <formApi.Field
          name="summary"
          onChange={(value) =>
            (value?.length ?? 0) > 255 ? "Too long" : undefined
          }
          children={(field) => (
            <Form.Item
              label="Summary"
              validateStatus={field.state.meta.errors.length > 0 ? "error" : ""}
              help={
                field.state.meta.errors.length > 0
                  ? field.state.meta.errors[0]
                  : undefined
              }
            >
              <Input.TextArea
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
          name="location"
          children={(field) => (
            <Form.Item
              label="Location"
              validateStatus={field.state.meta.errors.length > 0 ? "error" : ""}
              help={
                field.state.meta.errors.length > 0
                  ? field.state.meta.errors[0]
                  : undefined
              }
            >
              <Input
                name={field.name}
                value={field.state.value ?? undefined}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </Form.Item>
          )}
        />

        <List>
          <formApi.Field
            name="occurrences"
            onChange={(value) => {
              for (let i = 0; i < value.length; i++) {
                const occurrence = value[i]?.interval;
                if (occurrence && !occurrence.isValid) {
                  return `Occurrence ${i + 1} is invalid: ${
                    occurrence.invalidExplanation
                  }`;
                }
              }
              return undefined;
            }}
            children={(field) => (
              <Form.Item
                label="Occurrences"
                validateStatus={
                  field.state.meta.errors.length > 0 ? "error" : ""
                }
                help={
                  field.state.meta.errors.length > 0
                    ? field.state.meta.errors[0]
                    : undefined
                }
              >
                <List>
                  {field.state.value.map((occurrence, index) => (
                    <List.Item key={occurrence.uuid ?? index}>
                      <EventOccurrencePicker
                        defaultOccurrence={occurrence}
                        onChange={(value) => {
                          field.state.value.splice(index, 1, value);
                          field.handleChange(field.state.value);
                        }}
                      />
                    </List.Item>
                  ))}
                </List>
                <Button
                  type="dashed"
                  onClick={() => {
                    field.state.value.push({
                      fullDay: false,
                      interval: Interval.invalid("empty"),
                    });
                    field.handleChange(field.state.value);
                  }}
                  icon={<PlusOutlined />}
                >
                  Add occurrence
                </Button>
              </Form.Item>
            )}
          />
        </List>
        <formApi.Field
          name="description"
          children={(field) => (
            <Form.Item
              label="Description"
              validateStatus={field.state.meta.errors.length > 0 ? "error" : ""}
              help={
                field.state.meta.errors.length > 0
                  ? field.state.meta.errors[0]
                  : undefined
              }
            >
              <Input.TextArea
                name={field.name}
                value={field.state.value ?? undefined}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </Form.Item>
          )}
        />
        <Form.Item>
          <formApi.Subscribe
            children={({ canSubmit }) => (
              <Button type="primary" htmlType="submit" disabled={!canSubmit}>
                Save
              </Button>
            )}
          />
        </Form.Item>
      </Form>
    </formApi.Provider>
  );
}

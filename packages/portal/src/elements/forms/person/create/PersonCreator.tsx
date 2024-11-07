import { useNavigate } from "@tanstack/react-router";
import { App, Button, Flex, Form, Input } from "antd";

import { usePersonCreatorForm } from "./usePersonCreatorForm.js";

export function PersonCreator() {
  const navigate = useNavigate();

  const { message } = App.useApp();

  const { formApi } = usePersonCreatorForm((ret) => {
    if (ret?.id) {
      navigate({
        to: "/people/$personId/edit",
        params: { personId: ret.id },
      }).catch((error: unknown) => console.error(error));
    }
  });

  return (
    <Flex vertical gap="middle" align="center">
      <Form
        onFinish={() => {
          formApi.handleSubmit().catch((error: unknown) => {
            if (error instanceof Error) {
              void message.error(error.message);
            } else {
              void message.error("An unknown error occurred");
            }
          });
        }}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 32 }}
      >
        <formApi.Field
          name="name"
          children={(field) => (
            <Form.Item
              label="Name"
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
                value={field.state.value ?? ""}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </Form.Item>
          )}
        />
        <formApi.Field
          name="linkblue"
          children={(field) => (
            <Form.Item
              label="Linkblue"
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
                value={field.state.value ?? ""}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </Form.Item>
          )}
        />
        <formApi.Field
          name="email"
          validators={{
            onChange: ({ value }) => (!value ? "Email is required" : undefined),
          }}
          children={(field) => (
            <Form.Item
              label="Email"
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
        <Form.Item wrapperCol={{ span: 32, offset: 8 }}>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
}

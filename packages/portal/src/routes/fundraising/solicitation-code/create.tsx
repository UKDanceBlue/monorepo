import { useForm } from "@refinedev/antd";
import type { HttpError } from "@refinedev/core";
import { useBack } from "@refinedev/core";
import { createFileRoute } from "@tanstack/react-router";
import { Button, Flex, Form, Input, InputNumber } from "antd";

import { createSolicitationCodeDocument } from "#documents/solicitationCode.js";
import type { ResultOf, VariablesOf } from "#gql/index.js";

export const Route = createFileRoute("/fundraising/solicitation-code/create")({
  component: RouteComponent,
});

function RouteComponent() {
  const goBack = useBack();
  const { formProps } = useForm<
    ResultOf<typeof createSolicitationCodeDocument>,
    HttpError,
    VariablesOf<typeof createSolicitationCodeDocument>["input"]
  >({
    resource: "solicitationCode",
    meta: {
      gqlMutation: createSolicitationCodeDocument,
    },
    action: "create",
    defaultFormValues: {
      prefix: "DB",
    },
    onMutationSuccess: () => {
      goBack();
    },
  });

  return (
    <Flex justify="center" align="center" vertical>
      <h1>Create Solicitation Code</h1>
      <Flex justify="center" align="center">
        <Form
          {...formProps}
          style={{ maxWidth: 500 }}
          onFinish={(data) =>
            formProps.onFinish?.({
              ...data,
              name: data.name || undefined,
            })
          }
        >
          <Form.Item label="Name" name="name">
            <Input />
          </Form.Item>
          <Flex gap={16}>
            <Form.Item
              label="Prefix"
              name="prefix"
              rules={[{ required: true, min: 2 }]}
            >
              <Input style={{ width: "6ch" }} />
            </Form.Item>
            <Form.Item label="Code" name="code" rules={[{ required: true }]}>
              <InputNumber />
            </Form.Item>
          </Flex>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Create
            </Button>
          </Form.Item>
        </Form>
      </Flex>
    </Flex>
  );
}

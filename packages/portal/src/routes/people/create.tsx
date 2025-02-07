import { Create } from "@refinedev/antd";
import { createFileRoute } from "@tanstack/react-router";
import { Form, Input } from "antd";

import { graphql } from "#gql/index.ts";
import { withAuthorized } from "#hooks/useLoginState.tsx";
import { useTypedForm } from "#hooks/useTypedRefine.ts";

const CreatePersonMutation = graphql(/* GraphQL */ `
  mutation CreatePersonMutation($input: CreatePersonInput!) {
    createPerson(input: $input) {
      id
    }
  }
`);

function CreatePersonPage() {
  const { formProps, saveButtonProps } = useTypedForm({
    mutation: CreatePersonMutation,
    props: {
      action: "create",
      resource: "person",
    },
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps}>
        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Linkblue" name="linkblue">
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true }, { type: "email" }]}
        >
          <Input type="email" />
        </Form.Item>
      </Form>
    </Create>
  );
}

export const Route = createFileRoute("/people/create")({
  component: withAuthorized("create", "PersonNode")(<CreatePersonPage />),
});

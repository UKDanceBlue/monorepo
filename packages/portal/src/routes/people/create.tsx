import { Create } from "@refinedev/antd";
import { createFileRoute } from "@tanstack/react-router";
import { Form, Input } from "antd";

import { graphql } from "#gql/index.js";
import { useTypedForm } from "#hooks/refine/form.js";
import { withAuthorized } from "#hooks/useLoginState.js";

const CreatePersonMutation = graphql(/* GraphQL */ `
  mutation CreatePersonMutation($input: CreatePersonInput!) {
    createPerson(input: $input) {
      id
      name
      linkblue
      email
    }
  }
`);

function CreatePersonPage() {
  const { formProps, saveButtonProps, onFinish } = useTypedForm({
    mutation: CreatePersonMutation,
    props: {
      action: "create",
      resource: "person",
    },
    dataToForm(data) {
      return data;
    },
    formToVariables(formData) {
      return formData;
    },
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} onFinish={onFinish}>
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
  component: withAuthorized("create", "PersonNode")(CreatePersonPage),
});

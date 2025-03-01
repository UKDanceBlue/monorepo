import { TeamLegacyStatus } from "@ukdanceblue/common";
import { App, Button, Empty, Flex, Form, Input, Select } from "antd";

import { TeamEditorFragment } from "#documents/team.js";
import type { FragmentOf } from "#gql/index.js";
import { readFragment } from "#gql/index.js";

import { useTeamEditorForm } from "./useTeamEditorForm.js";

export function TeamEditor({
  teamFragment,
}: {
  teamFragment?: FragmentOf<typeof TeamEditorFragment> | null | undefined;
}) {
  const { message } = App.useApp();

  const { formApi } = useTeamEditorForm(teamFragment);

  const teamData = readFragment(TeamEditorFragment, teamFragment);

  if (!teamData) {
    return <Empty description="Team not found" style={{ marginTop: "1em" }} />;
  }

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
        style={{ minWidth: "25%" }}
      >
        <formApi.Field
          name="name"
          validators={{
            onChange: ({ value }) => (!value ? "Name is required" : undefined),
          }}
        >
          {(field) => (
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
        </formApi.Field>
        <p>Marathon Year: DB24</p>
        <p>Team Type: {formApi.getFieldValue("type")}</p>
        {formApi.getFieldValue("persistentIdentifier") ? (
          <p>
            Special Identifier: {formApi.getFieldValue("persistentIdentifier")}
          </p>
        ) : null}
        <formApi.Field
          name="legacyStatus"
          validators={{
            onChange: ({ value }) =>
              !value ? "Legacy Status is required" : undefined,
          }}
        >
          {(field) => (
            <Form.Item
              label="Legacy Status"
              validateStatus={field.state.meta.errors.length > 0 ? "error" : ""}
              help={
                field.state.meta.errors.length > 0
                  ? field.state.meta.errors[0]
                  : undefined
              }
            >
              <Select
                status={field.state.meta.errors.length > 0 ? "error" : ""}
                options={[
                  { label: "", value: "" },
                  {
                    label: "Returning Team",
                    value: TeamLegacyStatus.ReturningTeam,
                  },
                  { label: "New Team", value: TeamLegacyStatus.NewTeam },
                ]}
                value={field.state.value ?? ("" as const)}
                onBlur={field.handleBlur}
                onChange={(value) => {
                  if (value === "") {
                    field.handleChange(undefined);
                  } else {
                    field.handleChange(value);
                  }
                }}
              />
            </Form.Item>
          )}
        </formApi.Field>
        <Form.Item wrapperCol={{ span: 32, offset: 8 }}>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
}

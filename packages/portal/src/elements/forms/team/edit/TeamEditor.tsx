import { TeamLegacyStatus } from "@ukdanceblue/common";
import type { FragmentType } from "@ukdanceblue/common/graphql-client-portal";
import { getFragmentData } from "@ukdanceblue/common/graphql-client-portal";
import { App, Button, Empty, Flex, Form, Input, Select } from "antd";
import type { UseQueryExecute } from "urql";

import { TeamEditorFragment } from "./TeamEditorGQL";
import { useTeamEditorForm } from "./useTeamEditorForm";

export function TeamEditor({
  teamFragment,
  refetchTeam,
}: {
  teamFragment?: FragmentType<typeof TeamEditorFragment> | undefined;
  refetchTeam?: UseQueryExecute | undefined;
}) {
  const { message } = App.useApp();

  const { formApi } = useTeamEditorForm(teamFragment, () => {
    if (refetchTeam) {
      refetchTeam({ requestPolicy: "network-only" });
    }
  });

  const teamData = getFragmentData(TeamEditorFragment, teamFragment);

  if (!teamData) {
    return <Empty description="Team not found" style={{ marginTop: "1em" }} />;
  }

  return (
    <Flex vertical gap="middle" align="center">
      <formApi.Provider>
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
            onChange={(value) => (!value ? "Name is required" : undefined)}
          >
            {(field) => (
              <Form.Item
                label="Name"
                validateStatus={
                  field.state.meta.errors.length > 0 ? "error" : ""
                }
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
              Special Identifier:{" "}
              {formApi.getFieldValue("persistentIdentifier")}
            </p>
          ) : null}
          <formApi.Field
            name="legacyStatus"
            onChange={(value) =>
              !value ? "Legacy Status is required" : undefined
            }
          >
            {(field) => (
              <Form.Item
                label="Legacy Status"
                validateStatus={
                  field.state.meta.errors.length > 0 ? "error" : ""
                }
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
      </formApi.Provider>
    </Flex>
  );
}

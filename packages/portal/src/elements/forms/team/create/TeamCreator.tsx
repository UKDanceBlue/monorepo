import { useNavigate } from "@tanstack/react-router";
import { TeamLegacyStatus } from "@ukdanceblue/common";
import { App, Button, Flex, Form, Input, Select } from "antd";

import { useTeamCreatorForm } from "./useTeamCreatorForm";

export function TeamCreator({}: {}) {
  const navigate = useNavigate();

  const { message } = App.useApp();

  const { formApi } = useTeamCreatorForm((ret) => {
    if (ret?.uuid) {
      navigate({
        to: "/teams/$teamId/",
        params: { teamId: ret.uuid },
      }).catch(console.error);
    }
  });

  return (
    <Flex vertical gap="middle" align="center">
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
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 32 }}
        >
          <formApi.Field name="name">
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
          <p>Team Type: Spirit</p>
          {formApi.getFieldValue("persistentIdentifier") ? (
            <p>
              Special Identifier:{" "}
              {formApi.getFieldValue("persistentIdentifier")}
            </p>
          ) : null}
          <formApi.Field name="legacyStatus">
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
                    {
                      label: "Returning Team",
                      value: TeamLegacyStatus.ReturningTeam,
                    },
                    { label: "New Team", value: TeamLegacyStatus.NewTeam },
                  ]}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(value) => field.handleChange(value)}
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

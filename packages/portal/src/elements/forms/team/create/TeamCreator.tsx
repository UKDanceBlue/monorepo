import { useMarathon } from "@config/marathonContext";
import { TanAntFormItem } from "@elements/components/form/TanAntFormItem";
import { useNavigate } from "@tanstack/react-router";
import { TeamLegacyStatus, TeamType } from "@ukdanceblue/common";
import { App, Button, Flex, Form, Input, Select } from "antd";

import { useTeamCreatorForm } from "./useTeamCreatorForm";

export function TeamCreator() {
  const navigate = useNavigate();

  const { message } = App.useApp();

  const { formApi } = useTeamCreatorForm((ret) => {
    if (ret?.uuid) {
      navigate({
        to: "/teams/$teamId/",
        params: { teamId: ret.uuid },
      }).catch((error: unknown) => console.error(error));
    }
  });

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
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Form.Item>
            )}
          </formApi.Field>
          <p>Marathon Year: {useMarathon()?.year}</p>
          <TanAntFormItem
            formApi={formApi}
            fieldProps={{
              validate(value: TeamType | "" | undefined) {
                if (!value) {
                  return "This field is required";
                }

                return undefined;
              },
            }}
            name="type"
          >
            {({ onBlur, onChange, value, status }) => (
              <Select
                status={status}
                options={[
                  { label: "Spirit", value: TeamType.Spirit },
                  { label: "Morale", value: TeamType.Morale },
                ]}
                value={value}
                onBlur={onBlur}
                onChange={(value) => onChange(value)}
              />
            )}
          </TanAntFormItem>
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

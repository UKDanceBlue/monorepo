import { useNavigate } from "@tanstack/react-router";
import { TeamLegacyStatus, TeamType } from "@ukdanceblue/common";
import { App, Button, Flex, Form, Input, Select } from "antd";

import { TanAntFormItem } from "#elements/components/form/TanAntFormItem.js";

import { useTeamCreatorForm } from "./useTeamCreatorForm.js";

export function TeamCreator({
  selectedMarathon,
}: {
  selectedMarathon: {
    id: string;
    year: string;
  } | null;
}) {
  const navigate = useNavigate();

  const { message } = App.useApp();

  const { formApi } = useTeamCreatorForm((ret) => {
    if (ret?.id) {
      navigate({
        to: "/teams/$teamId",
        params: { teamId: ret.id },
      }).catch((error: unknown) => console.error(error));
    }
  }, selectedMarathon?.id);

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
        <formApi.Field name="name">
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
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </Form.Item>
          )}
        </formApi.Field>
        <p>Marathon Year: {selectedMarathon?.year}</p>
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
                { label: "Spirit Team", value: TeamType.Spirit },
                { label: "Morale Team", value: TeamType.Morale },
                { label: "Mini Marathon", value: TeamType.Mini },
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
    </Flex>
  );
}

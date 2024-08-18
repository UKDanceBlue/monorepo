import { PersonSearch } from "@elements/components/PersonSearch";
import { useAntFeedback } from "@hooks/useAntFeedback";
import { useNavigate } from "@tanstack/react-router";
import { Button, Checkbox, Flex, Form, Input, Select } from "antd";
import TextArea from "antd/es/input/TextArea";

import { NotificationPreview } from "../../../components/NotificationPreview";
import { useNotificationCreator } from "./useNotificationCreator";

export const CreateNotificationForm = () => {
  const navigate = useNavigate();

  const { appMessage } = useAntFeedback();

  const { formApi } = useNotificationCreator((data) => {
    if (data?.uuid) {
      navigate({
        to: "/notifications/$notificationId/",
        params: {
          notificationId: data.uuid,
        },
      }).catch((error: unknown) => console.error(error));
    }
  });

  return (
    <Flex vertical gap="middle" align="center">
      <formApi.Subscribe selector={(state) => state.values}>
        {({ title, body }) => (
          <NotificationPreview
            title={title || "Example Title"}
            body={body || "Body of the notification."}
          />
        )}
      </formApi.Subscribe>
      <Form
        layout="vertical"
        onFinish={() => {
          formApi.handleSubmit().catch((error: unknown) => {
            if (error instanceof Error) {
              void appMessage.error(error.message);
            } else {
              void appMessage.error("An unknown error occurred");
            }
          });
        }}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 32 }}
      >
        <formApi.Field
          name="title"
          onChange={(value) => (!value ? "Title is required" : undefined)}
        >
          {(field) => (
            <Form.Item
              label="Title"
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
                style={{ width: "70ch" }}
                placeholder="Example Title"
              />
            </Form.Item>
          )}
        </formApi.Field>
        <formApi.Field
          name="body"
          onChange={(value) => (!value ? "Body is required" : undefined)}
        >
          {(field) => (
            <Form.Item
              label="Body"
              validateStatus={field.state.meta.errors.length > 0 ? "error" : ""}
              help={
                field.state.meta.errors.length > 0
                  ? field.state.meta.errors[0]
                  : undefined
              }
            >
              <TextArea
                status={field.state.meta.errors.length > 0 ? "error" : ""}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                style={{ width: "70ch" }}
                placeholder="Body of the notification."
              />
            </Form.Item>
          )}
        </formApi.Field>
        <formApi.Field
          name="url"
          onChange={(value) => {
            if (value) {
              try {
                new URL(value);
              } catch {
                return "Invalid URL";
              }
            }
            return undefined;
          }}
        >
          {(field) => (
            <Form.Item
              label="URL"
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
                style={{ width: "70ch" }}
              />
            </Form.Item>
          )}
        </formApi.Field>
        <formApi.Field name="audience">
          {(field) => (
            <Form.Item label="Audience">
              <Checkbox
                checked={field.getValue().all}
                onChange={(e) =>
                  field.setValue(
                    e.target.checked
                      ? {
                          all: true,
                        }
                      : {}
                  )
                }
              >
                All users
              </Checkbox>
              {!field.getValue().all ? (
                <div>
                  <label>Individual</label>
                  <PersonSearch
                    onSelect={(person) => {
                      field.setValue({
                        users: [person.uuid],
                      });
                    }}
                    value={field.getValue().users?.[0]}
                  />

                  <label>Type</label>
                  <Select
                    value={field.getValue().memberOfTeamType ?? ("" as const)}
                    onChange={(value) =>
                      field.setValue({
                        memberOfTeamType: value === "" ? undefined : value,
                      })
                    }
                  >
                    <Select.Option value="">Any</Select.Option>
                    <Select.Option value="Spirit">Spirit</Select.Option>
                    <Select.Option value="Morale">Morale</Select.Option>
                    <Select.Option value="Committee">Committee</Select.Option>
                  </Select>
                </div>
              ) : null}
            </Form.Item>
          )}
        </formApi.Field>
        <Form.Item
          wrapperCol={{
            span: 32,
            offset: 8,
          }}
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button type="primary" htmlType="submit">
            Create
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
};

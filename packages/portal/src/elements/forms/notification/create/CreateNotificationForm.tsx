import { PersonSearch } from "@elements/components/person/PersonSearch";
import { useAntFeedback } from "@hooks/useAntFeedback";
import { useNavigate } from "@tanstack/react-router";
import { Button, Checkbox, Flex, Form, Input, Select } from "antd";
import TextArea from "antd/es/input/TextArea";

import { NotificationPreview } from "../../../components/notification/NotificationPreview";
import { useNotificationCreator } from "./useNotificationCreator";

export const CreateNotificationForm = () => {
  const navigate = useNavigate();

  const { appMessage, showErrorMessage } = useAntFeedback();

  const { formApi } = useNotificationCreator((data) => {
    if (data?.uuid) {
      navigate({
        to: "/notifications/$notificationId",
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
          validators={{
            onChange: ({ value }) => (!value ? "Title is required" : undefined),
          }}
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
          validators={{
            onChange: ({ value }) => (!value ? "Body is required" : undefined),
          }}
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
          validators={{
            onChange: ({ value }) => {
              if (value) {
                try {
                  new URL(value);
                } catch {
                  return "Invalid URL";
                }
              }
              return undefined;
            },
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
        <formApi.Field name="audience.all">
          {(field) => (
            <Form.Item label="Audience">
              <Checkbox
                checked={field.state.value}
                onChange={(e) => field.setValue(e.target.checked)}
              >
                All users
              </Checkbox>
            </Form.Item>
          )}
        </formApi.Field>
        <formApi.Subscribe selector={(state) => state.values.audience.all}>
          {(all) =>
            !all ? (
              <div>
                <Form.Item>
                  <label>Individual</label>
                  <formApi.Field name="audience.users" mode="array">
                    {(field) => (
                      <>
                        <ul>
                          {field.state.value?.map(
                            ({ id, linkblue, name }, idx) => (
                              <li key={id}>
                                {name ?? linkblue ?? id}{" "}
                                <Button onClick={() => field.removeValue(idx)}>
                                  Remove
                                </Button>
                              </li>
                            )
                          )}
                        </ul>
                        <PersonSearch
                          onSelect={(person, _, clear) => {
                            if (
                              field.state.value?.some(
                                (user) => user.id === person.uuid
                              )
                            ) {
                              showErrorMessage("User already added");
                            } else {
                              field.pushValue({
                                id: person.uuid,
                                name: person.name,
                                linkblue: person.linkblue,
                              });
                              clear();
                            }
                          }}
                        />
                      </>
                    )}
                  </formApi.Field>
                </Form.Item>
                <formApi.Field name="audience.memberOfTeamType">
                  {(field) => (
                    <Form.Item>
                      <label>Type</label>
                      <Select
                        value={field.state.value ?? ("" as const)}
                        onChange={(value) =>
                          field.setValue(value === "" ? undefined : value)
                        }
                      >
                        <Select.Option value="">Any</Select.Option>
                        <Select.Option value="Spirit">Spirit</Select.Option>
                        <Select.Option value="Morale">Morale</Select.Option>
                      </Select>
                    </Form.Item>
                  )}
                </formApi.Field>
              </div>
            ) : null
          }
        </formApi.Subscribe>
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

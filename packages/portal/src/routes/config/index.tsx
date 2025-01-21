import { List } from "@refinedev/antd";
import { createFileRoute } from "@tanstack/react-router";
import { Button, Collapse, Divider, Flex, Form, Input, Space } from "antd";
import { useState } from "react";

import { ConfigItem } from "#elements/forms/config/ConfigItem.js";
import { useConfigForm } from "#elements/forms/config/useConfigForm.js";

// Form keys can only contain uppercase letters and underscores
const FORM_KEY_REGEX = /^[A-Z_]+$/;

function ConfigPage() {
  const { formApi, addConfigKey, activeValues } = useConfigForm();

  const [newKey, setNewKey] = useState("");

  return (
    <List title="Config" canCreate={false}>
      <p>
        These configuration values are used to modify the behavior of the
        DanceBlue mobile app. Each value can have an assigned start and end
        date. The most recently set value will always be used as long as it is
        within its validity period.
      </p>

      <Form
        onFinish={() =>
          formApi.handleSubmit().catch((error: unknown) => console.error(error))
        }
      >
        <formApi.Subscribe selector={(state) => Object.keys(state.values)}>
          {(keys) =>
            keys.map((key) => (
              <Flex vertical gap="small" key={key}>
                <formApi.Field
                  name={`${key}.new`}
                  defaultValue={activeValues[key] ?? { value: "" }}
                >
                  {(field) => (
                    <ConfigItem
                      editable
                      configKey={key}
                      configValueUuid="new"
                      configValue={field.state.value ?? { value: "" }}
                      errors={field.state.meta.errors}
                      onChange={field.handleChange}
                    />
                  )}
                </formApi.Field>
                <formApi.Subscribe selector={(state) => state.values[key]!.old}>
                  {(oldConfigs) =>
                    oldConfigs.length > 0 && (
                      <Collapse
                        style={{ marginBottom: "1rem" }}
                        items={[
                          {
                            label: "Inactive Values",
                            key: "inactive",
                            children: oldConfigs.map(([uuid, config]) => (
                              <ConfigItem
                                key={`${key}.${uuid}`}
                                editable={false}
                                configKey={key}
                                configValueUuid={uuid}
                                configValue={
                                  config ?? { value: "ERR: No value" }
                                }
                              />
                            )),
                          },
                        ]}
                      />
                    )
                  }
                </formApi.Subscribe>
              </Flex>
            ))
          }
        </formApi.Subscribe>
        <Divider style={{ marginTop: "0.5rem" }} />
        <Flex justify="space-between" align="end" gap="small" wrap="wrap">
          <Form.Item
            label="New Key"
            validateStatus={
              newKey === "" || FORM_KEY_REGEX.test(newKey) ? "" : "error"
            }
            help={
              newKey === "" || FORM_KEY_REGEX.test(newKey)
                ? undefined
                : "Key must only contain uppercase letters and underscores"
            }
            style={{ marginBottom: 0 }}
          >
            <Space.Compact>
              <Input
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                  }
                }}
              />
              <Button
                onClick={() => {
                  addConfigKey(newKey);
                  setNewKey("");
                }}
                disabled={!FORM_KEY_REGEX.test(newKey)}
              >
                Add
              </Button>
            </Space.Compact>
          </Form.Item>
          <Button htmlType="submit" type="primary">
            Commit Changes
          </Button>
        </Flex>
      </Form>
    </List>
  );
}

export const Route = createFileRoute("/config/")({
  component: ConfigPage,
});

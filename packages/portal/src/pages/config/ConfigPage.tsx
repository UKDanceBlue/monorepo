import { Button, Flex, Form, Input, Space } from "antd";
import { useState } from "react";

import { ConfigItem } from "./ConfigItem";
import { useConfigForm } from "./useConfigForm";

// Form keys can only contain uppercase letters and underscores
const FORM_KEY_REGEX = /^[A-Z_]+$/;

export function ConfigPage() {
  const { formApi, addConfigKey, activeValues } = useConfigForm();

  const [newKey, setNewKey] = useState("");

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <formApi.Provider>
        <Form onFinish={(values) => console.log(values)}>
          <formApi.Subscribe selector={(state) => Object.keys(state.values)}>
            {(keys) =>
              keys.map((key) => (
                <formApi.Field
                  name={`${key}.new`}
                  defaultValue={activeValues[key] ?? { value: "" }}
                >
                  {(field) => (
                    <ConfigItem
                      configKey={key}
                      configValueUuid="new"
                      fieldApi={field}
                    />
                  )}
                </formApi.Field>
              ))
            }
          </formApi.Subscribe>
          <Flex justify="space-between" align="end" gap="small">
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
      </formApi.Provider>
    </div>
  );
}

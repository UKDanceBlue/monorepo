import { Button, Flex, Form, Input } from "antd";
import { useState } from "react";

import { useConfigForm } from "./useConfigForm";

export function ConfigPage() {
  const { formApi, addConfigKey, activeValues } = useConfigForm();

  const [newKey, setNewKey] = useState("");

  return (
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
                  <Form.Item
                    label={key}
                    name={`${key}.new`}
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
                      value={field.state.value?.value}
                      onChange={(e) =>
                        field.handleChange((old) => ({
                          ...old,
                          value: e.target.value,
                        }))
                      }
                    />
                  </Form.Item>
                )}
              </formApi.Field>
            ))
          }
        </formApi.Subscribe>
      </Form>
      <Flex>
        <Input
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          onPressEnter={() => {
            addConfigKey(newKey);
            setNewKey("");
          }}
        />
        <Button onClick={() => addConfigKey(newKey)}>Add</Button>
      </Flex>
    </formApi.Provider>
  );
}

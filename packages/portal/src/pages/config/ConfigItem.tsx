import type { FieldApi } from "@tanstack/react-form";
import { Form, Input } from "antd";

import type { ConfigValue } from "./useConfig";

export function ConfigItem<
  Key extends string,
  Editable extends boolean,
  Uuid extends Editable extends true ? "new" : string,
>({
  configKey,
  configValueUuid,
  fieldApi,
}: {
  configKey: Key;
  configValueUuid: Uuid;
  fieldApi: FieldApi<
    Record<string, Record<string, ConfigValue | undefined>>,
    `${Key}.${Uuid}`
  >;
}) {
  return (
    <Form.Item
      label={configKey}
      name={`${configKey}.${configValueUuid}`}
      validateStatus={fieldApi.state.meta.errors.length > 0 ? "error" : ""}
      help={
        fieldApi.state.meta.errors.length > 0
          ? fieldApi.state.meta.errors[0]
          : undefined
      }
    >
      <Input
        value={fieldApi.getValue()?.value ?? ""}
        onChange={(e) =>
          fieldApi.handleChange((old) => ({
            ...old,
            value: e.target.value,
          }))
        }
      />
    </Form.Item>
  );
}

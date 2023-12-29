import type { Updater, ValidationError } from "@tanstack/react-form";
import { Form, Input } from "antd";

import type { ConfigValue } from "./useConfig";

export function ConfigItem<Key extends string, Editable extends boolean>({
  editable,
  configKey,
  configValueUuid,
  errors = [],
  configValue,
  onChange,
}: {
  editable: Editable;
  configKey: Key;
  configValue: ConfigValue;
} & (Editable extends true
  ? {
      configValueUuid: "new";
      errors: ValidationError[];
      onChange: (updater: Updater<ConfigValue | undefined>) => void;
    }
  : {
      configValueUuid: string;
      errors?: [];
      onChange?: never;
    })) {
  return (
    <Form.Item
      label={configKey}
      name={`${configKey}.${configValueUuid}`}
      validateStatus={errors.length > 0 ? "error" : ""}
      help={errors.length > 0 ? errors[0] : undefined}
    >
      <Input
        value={configValue.value}
        onChange={
          editable
            ? (e) =>
                onChange?.((old) => ({
                  ...old,
                  value: e.target.value,
                }))
            : undefined
        }
        disabled={!editable}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
      />
    </Form.Item>
  );
}

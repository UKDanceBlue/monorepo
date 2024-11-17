import type { Updater, ValidationError } from "@tanstack/react-form";
import { Form, Input, Space } from "antd";
import { DateTime } from "luxon";
import { useMemo } from "react";

import { LuxonDatePicker } from "@/elements/components/antLuxonComponents.js";

import type { ConfigValue } from "./useConfig.js";

export function ConfigItem<Editable extends boolean>({
  editable,
  configKey,
  configValueUuid,
  errors = [],
  configValue,
  onChange,
}: {
  editable: Editable;
  configKey: string;
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
  const validityCondition = useMemo(() => {
    let validityString =
      "This config is active when it is the most recent valid value";

    if (configValue.validAfter) {
      validityString += ` after ${configValue.validAfter.toLocaleString(
        DateTime.DATETIME_SHORT
      )}`;
    }

    if (configValue.validUntil) {
      if (configValue.validUntil < DateTime.now()) {
        // Short circuit as this config is no longer valid
        return "This config will never be active";
      }
      if (configValue.validAfter) {
        validityString += " and";
      }
      validityString += ` until ${configValue.validUntil.toLocaleString(
        DateTime.DATETIME_SHORT
      )}`;
    }

    return validityString;
  }, [configValue]);

  return (
    <>
      <Form.Item
        label={configKey}
        name={`${configKey}.${configValueUuid}`}
        validateStatus={errors.length > 0 ? "error" : ""}
        help={errors.length > 0 ? errors[0] : undefined}
      >
        <Space direction="vertical">
          <Input
            value={editable ? configValue.value : undefined}
            placeholder={editable ? "Value" : configValue.value}
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
            style={{ fontFamily: "monospace" }}
          />
          <Space direction="horizontal">
            <LuxonDatePicker
              showTime
              value={configValue.validAfter ?? null}
              placeholder="Valid after"
              onChange={(value) =>
                editable
                  ? onChange?.((old) => ({
                      value: "",
                      ...old,
                      validAfter: value,
                    }))
                  : undefined
              }
              disabled={!editable}
            />
            -
            <LuxonDatePicker
              showTime
              value={configValue.validUntil ?? null}
              placeholder="Valid until"
              onChange={(value) =>
                editable
                  ? onChange?.((old) => ({
                      value: "",
                      ...old,
                      validUntil: value,
                    }))
                  : undefined
              }
              disabled={!editable}
            />
          </Space>
        </Space>
        <p>{validityCondition}</p>
      </Form.Item>
    </>
  );
}

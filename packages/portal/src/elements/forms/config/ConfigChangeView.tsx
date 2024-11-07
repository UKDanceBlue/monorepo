import { Descriptions } from "antd";
import { DateTime } from "luxon";

import type { ConfigValue } from "./useConfig.js";

export function ConfigChangeView({
  oldConfig,
  newConfig,
}: {
  oldConfig: ConfigValue | undefined;
  newConfig: ConfigValue;
}) {
  return (
    <Descriptions bordered>
      <Descriptions.Item label="Content">
        {oldConfig
          ? `${oldConfig.value} -> ${newConfig.value}`
          : newConfig.value}
      </Descriptions.Item>
      {newConfig.validAfter && (
        <Descriptions.Item label="Valid After">
          {oldConfig?.validAfter
            ? `${oldConfig.validAfter.toLocaleString(
                DateTime.DATETIME_SHORT
              )} -> ${newConfig.validAfter.toLocaleString(
                DateTime.DATETIME_SHORT
              )}`
            : newConfig.validAfter.toLocaleString(DateTime.DATETIME_SHORT)}
        </Descriptions.Item>
      )}
      {newConfig.validUntil && (
        <Descriptions.Item label="Valid Until">
          {oldConfig?.validUntil
            ? `${oldConfig.validUntil.toLocaleString(
                DateTime.DATETIME_SHORT
              )} -> ${newConfig.validUntil.toLocaleString(
                DateTime.DATETIME_SHORT
              )}`
            : newConfig.validUntil.toLocaleString(DateTime.DATETIME_SHORT)}
        </Descriptions.Item>
      )}
    </Descriptions>
  );
}

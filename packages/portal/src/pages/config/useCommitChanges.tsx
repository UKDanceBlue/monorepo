import { useAntFeedback } from "@hooks/useAntFeedback";
import { List } from "antd";
import { useCallback } from "react";

import { ConfigChangeView } from "./ConfigChangeView";
import type { ConfigValue } from "./useConfig";

export function useCommitChanges(): (
  newValues: Record<string, ConfigValue>,
  activeValues: Record<string, ConfigValue>
) => Promise<void> {
  const { showConfirmModal, showInfoMessage } = useAntFeedback();

  return useCallback(
    async (newValues, activeValues) => {
      const changes = Object.entries(newValues).reduce<
        Record<string, { old: ConfigValue | undefined; new: ConfigValue }>
      >((acc, [key, value]) => {
        const activeValue = activeValues[key];
        if (
          activeValue?.value !== value.value ||
          activeValue.validAfter !== value.validAfter ||
          activeValue.validUntil !== value.validUntil
        ) {
          acc[key] = {
            old: activeValue,
            new: value,
          };
        }
        return acc;
      }, {});

      if (Object.keys(changes).length > 0) {
        const result = await new Promise<boolean>((resolve) => {
          showConfirmModal({
            title: "Confirm changes",
            content: (
              <List
                itemLayout="vertical"
                dataSource={Object.entries(changes)}
                renderItem={([key, { old: oldConfig, new: newConfig }]) => (
                  <List.Item>
                    <List.Item.Meta title={key} />
                    <ConfigChangeView
                      oldConfig={oldConfig}
                      newConfig={newConfig}
                    />
                  </List.Item>
                )}
              />
            ),
            onOk: () => resolve(true),
            onCancel: () => resolve(false),
            okText: "Yes",
            cancelText: "No",
          });
        });
        if (result) {
          await showInfoMessage("Changes committed");
          return;
        } else {
          return;
        }
      } else {
        await showInfoMessage("No changes to commit");
        return;
      }
    },
    [showConfirmModal, showInfoMessage]
  );
}

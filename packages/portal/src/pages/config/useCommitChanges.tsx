import { ConfigChangeView } from "./ConfigChangeView";

import { useAntFeedback } from "@hooks/useAntFeedback";
import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { graphql } from "@ukdanceblue/common/graphql-client-portal";
import { List } from "antd";
import { useCallback } from "react";
import { useMutation } from "urql";

import type { ConfigValue } from "./useConfig";

const commitConfigChangesMutation = graphql(/* GraphQL */ `
  mutation CommitConfigChanges($changes: [CreateConfigurationInput!]!) {
    createConfigurations(input: $changes) {
      ok
    }
  }
`);

export function useCommitChanges(): (
  newValues: Record<string, ConfigValue>,
  activeValues: Record<string, ConfigValue>
) => Promise<void> {
  const { showConfirmModal, showInfoMessage } = useAntFeedback();

  const [{ fetching, error }, doMutation] = useMutation(
    commitConfigChangesMutation
  );

  useQueryStatusWatcher({
    fetching,
    error,
    loadingMessage: "Committing changes",
  });

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
          void showConfirmModal({
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
            width: "80%",
          });
        });
        if (result) {
          const changesArray: Parameters<typeof doMutation>[0]["changes"] =
            Object.entries(changes).map(([key, { new: value }]) => ({
              key,
              value: value.value,
              validAfter: value.validAfter?.toISO() ?? null,
              validUntil: value.validUntil?.toISO() ?? null,
            }));

          await doMutation({ changes: changesArray });
        }
      } else {
        await showInfoMessage("No changes to commit");
      }
    },
    [doMutation, showConfirmModal, showInfoMessage]
  );
}

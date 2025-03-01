import { dateTimeFromSomething } from "@ukdanceblue/common";
import { DateTime, Interval } from "luxon";
import { useMemo } from "react";

import { graphql, readFragment } from "#gql/index.js";
import { useQuery } from "#hooks/refine/custom.js";
import { useQueryStatusWatcher } from "#hooks/useQueryStatusWatcher.js";

export const ConfigFragment = graphql(/* GraphQL */ `
  fragment ConfigFragment on ConfigurationNode {
    id
    key
    value
    validAfter
    validUntil
    createdAt
  }
`);

export interface ConfigValue {
  value: string;
  validAfter?: DateTime | undefined | null;
  validUntil?: DateTime | undefined | null;
  createdAt?: DateTime | undefined | null;
}

interface ConfigValueCollection {
  key: string;
  values: Record<string, ConfigValue>;
}

export function useConfig(): {
  loading: boolean;
  configs: ConfigValueCollection[];
  activeValues: Record<string, ConfigValue>;
} {
  const [{ data: response, fetching, error }] = useQuery({
    query: graphql(
      /* GraphQL */ `
        query ConfigQuery {
          allConfigurations {
            ...ConfigFragment
          }
        }
      `,
      [ConfigFragment]
    ),
  });

  useQueryStatusWatcher({
    fetching,
    error,
    loadingMessage: "Loading configurations",
  });

  const { configs, activeValues } = useMemo(() => {
    if (!response) return { configs: [], activeValues: {} };
    const configs: ConfigValueCollection[] = [];
    const activeValues: Record<string, ConfigValue> = {};

    const data = readFragment(ConfigFragment, response.allConfigurations ?? []);

    for (const config of data) {
      // Add the config key if it doesn't exist
      if (!configs.some((c) => c.key === config.key)) {
        configs.push({
          key: config.key,
          values: {},
        });
      }

      const configValue = {
        value: config.value,
        validAfter: config.validAfter
          ? dateTimeFromSomething(config.validAfter)
          : null,
        validUntil: config.validUntil
          ? dateTimeFromSomething(config.validUntil)
          : null,
        createdAt: config.createdAt
          ? typeof config.createdAt === "string"
            ? DateTime.fromISO(config.createdAt)
            : DateTime.fromJSDate(config.createdAt)
          : null,
      };

      // Add the config value
      configs.find((c) => c.key === config.key)!.values[config.id] =
        configValue;

      // Decide if this is an active value
      const isActive = Interval.fromDateTimes(
        configValue.validAfter ?? DateTime.fromMillis(0),
        configValue.validUntil ?? DateTime.fromObject({ year: 9999 })
      ).contains(DateTime.now());

      // If this is an active value and is newer than the current active value,
      // replace the current active value
      if (isActive) {
        if (!activeValues[config.key]) {
          activeValues[config.key] = configValue;
        } else {
          let replace = false;

          if (
            // If the current active value's createdAt is older than this value's
            // createdAt, replace it
            configValue.createdAt &&
            activeValues[config.key]!.createdAt &&
            configValue.createdAt > activeValues[config.key]!.createdAt!
          ) {
            replace = true;
          } else if (
            // If the current active value doesn't have a createdAt, but this
            // value does, replace it
            configValue.createdAt &&
            !activeValues[config.key]!.createdAt
          ) {
            replace = true;
          }

          // If none of the above conditions are met, don't replace the current
          // active value as it is newer (as far as we know)

          if (replace) {
            activeValues[config.key] = configValue;
          }
        }
      }
    }

    return {
      configs,
      activeValues,
    };
  }, [response]);

  return {
    loading: fetching,
    configs,
    activeValues,
  };
}

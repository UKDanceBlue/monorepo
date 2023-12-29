import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import {
  getFragmentData,
  graphql,
} from "@ukdanceblue/common/graphql-client-admin";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { useQuery } from "urql";

export const ConfigFragment = graphql(/* GraphQL */ `
  fragment ConfigFragment on ConfigurationResource {
    uuid
    key
    value
    validAfter
    validUntil
    createdAt
  }
`);

interface Config {
  key: string;
  values: {
    [uuid: string]: {
      value: string;
      validAfter: DateTime | null;
      validUntil: DateTime | null;
      createdAt: DateTime | null;
    };
  };
}

export function useConfig(): {
  loading: boolean;
  configs: Config[];
} {
  const [{ data: response, fetching, error }] = useQuery({
    query: graphql(/* GraphQL */ `
      query ConfigQuery {
        allConfigurations {
          data {
            ...ConfigFragment
          }
        }
      }
    `),
  });

  useQueryStatusWatcher({
    fetching,
    error,
    loadingMessage: "Loading configurations",
  });

  const configs = useMemo(() => {
    if (!response) return [];
    const configs: Config[] = [];

    const data = getFragmentData(
      ConfigFragment,
      response.allConfigurations.data
    );

    for (const config of data) {
      // Add the config key if it doesn't exist
      if (!configs.some((c) => c.key === config.key)) {
        configs.push({
          key: config.key,
          values: {},
        });
      }

      // Add the config value
      configs.find((c) => c.key === config.key)!.values[config.uuid] = {
        value: config.value,
        validAfter: config.validAfter
          ? DateTime.fromISO(config.validAfter)
          : null,
        validUntil: config.validUntil
          ? DateTime.fromISO(config.validUntil)
          : null,
        createdAt: config.createdAt
          ? typeof config.createdAt === "string"
            ? DateTime.fromISO(config.createdAt)
            : DateTime.fromJSDate(config.createdAt)
          : null,
      };
    }
    return configs;
  }, [response]);

  return {
    loading: fetching,
    configs,
  };
}

import { useEffect, useMemo } from "react";
import { useQuery } from "urql";

import { SimpleConfigFragment } from "@/common/fragments/Configuration";
import { graphql, readFragment } from "@/graphql/index";

import { Logger } from "../logger/Logger";

const useAllowedLoginTypesQuery = graphql(
  /* GraphQL */ `
    query useAllowedLoginTypes {
      activeConfiguration(key: "ALLOWED_LOGIN_TYPES") {
        data {
          ...SimpleConfig
        }
      }
    }
  `,
  [SimpleConfigFragment]
);

export function useAllowedLoginTypes(): {
  allowedLoginTypesLoading: boolean;
  allowedLoginTypes: string[];
} {
  const [{ data, fetching, error }] = useQuery({
    query: useAllowedLoginTypesQuery,
  });
  const configValue = readFragment(
    SimpleConfigFragment,
    data?.activeConfiguration?.data
  );

  useEffect(() => {
    if (error) {
      Logger.error("Error fetching allowed login types", { error });
    }
  }, [error]);

  const allowedTypes = useMemo(() => {
    const allowedTypes: string[] = [];

    try {
      if (configValue) {
        const parsed = JSON.parse(configValue.value) as unknown;
        if (Array.isArray(parsed)) {
          for (const type of parsed) {
            if (type === "anonymous") {
              allowedTypes.push("anonymous");
            } else if (type === "ms-oath-linkblue") {
              allowedTypes.push("ms-oath-linkblue");
            } else {
              Logger.warn(`Unrecognized login type: ${String(type)}`);
            }
          }
        } else {
          Logger.error(
            `Invalid allowed login types configuration: ${configValue.value}`
          );
        }
      }
    } catch (error) {
      Logger.error("Error parsing allowed login types", { error });
    }

    return allowedTypes;
  }, [configValue]);

  return {
    allowedLoginTypesLoading: fetching,
    allowedLoginTypes: allowedTypes,
  };
}

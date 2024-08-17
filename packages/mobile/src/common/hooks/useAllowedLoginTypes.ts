import { SimpleConfigFragment } from "@common/fragments/Configuration";
import { log, logError } from "@common/logging";
import {
  getFragmentData,
  graphql,
} from "@ukdanceblue/common/graphql-client-mobile";
import { useEffect, useMemo } from "react";
import { useQuery } from "urql";

const useAllowedLoginTypesQuery = graphql(/* GraphQL */ `
  query useAllowedLoginTypes {
    activeConfiguration(key: "ALLOWED_LOGIN_TYPES") {
      data {
        ...SimpleConfig
      }
    }
  }
`);

export function useAllowedLoginTypes(): {
  allowedLoginTypesLoading: boolean;
  allowedLoginTypes: string[];
} {
  const [{ data, fetching, error }] = useQuery({
    query: useAllowedLoginTypesQuery,
  });
  const configValue = getFragmentData(
    SimpleConfigFragment,
    data?.activeConfiguration.data
  );

  useEffect(() => {
    if (error) {
      logError(error);
    }
  });

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
              log(`Unrecognized login type: ${type}`, "warn");
            }
          }
        } else {
          log(
            `Invalid allowed login types configuration: ${configValue.value}`
          );
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        logError(error);
      } else {
        log(String(error), "error");
      }
    }

    return allowedTypes;
  }, [configValue]);

  return {
    allowedLoginTypesLoading: fetching,
    allowedLoginTypes: allowedTypes,
  };
}

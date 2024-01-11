import { SimpleConfigFragment } from "@common/fragments/Configuration";
import { log, logError } from "@common/logging";
import {
  getFragmentData,
  graphql,
} from "@ukdanceblue/common/dist/graphql-client-public";
import { useEffect, useMemo } from "react";
import { useQuery } from "urql";

const useTabBarConfigQuery = graphql(/* GraphQL */ `
  query useTabBarConfig {
    activeConfiguration(key: "TAB_BAR_CONFIG") {
      data {
        ...SimpleConfig
      }
    }
  }
`);

export function useTabBarConfig(): {
  tabConfigLoading: boolean;
  fancyTab: string | undefined;
  shownTabs: string[];
} {
  const [{ data, fetching, error }] = useQuery({
    query: useTabBarConfigQuery,
  });
  const tabBarConfig = getFragmentData(
    SimpleConfigFragment,
    data?.activeConfiguration.data
  );

  useEffect(() => {
    if (error) {
      logError(error);
    }
  });

  const { fancyTab, shownTabs } = useMemo(() => {
    let fancyTab: string | undefined = undefined;
    const shownTabs: string[] = [];

    try {
      if (tabBarConfig) {
        const parsed = JSON.parse(tabBarConfig.value) as unknown;
        if (typeof parsed === "object" && parsed !== null) {
          if ("fancyTab" in parsed) {
            if (typeof parsed.fancyTab === "string") {
              if (parsed.fancyTab) {
                ({ fancyTab } = parsed);
              }
            } else {
              log(
                `Invalid fancyTab value in tab bar configuration: ${String(
                  parsed.fancyTab
                )}`
              );
            }
          }
          if ("shownTabs" in parsed) {
            if (Array.isArray(parsed.shownTabs)) {
              for (const tab of parsed.shownTabs) {
                if (typeof tab === "string") {
                  if (tab) {
                    shownTabs.push(tab);
                  }
                } else {
                  log(
                    `Invalid shownTabs value in tab bar configuration: ${String(
                      tab
                    )}`
                  );
                }
              }
            } else {
              log(
                `Invalid shownTabs value in tab bar configuration: ${String(
                  parsed.shownTabs
                )}`
              );
            }
          }
        } else {
          log(`Invalid allowed tab bar configuration: ${tabBarConfig.value}`);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        logError(error);
      } else {
        log(String(error), "error");
      }
    }

    return { fancyTab, shownTabs };
  }, [tabBarConfig]);

  return {
    tabConfigLoading: fetching,
    fancyTab,
    shownTabs,
  };
}

import { SimpleConfigFragment } from "@common/fragments/Configuration";
import { Logger } from "@common/logger/Logger";
import { getFragmentData, graphql } from "@graphql";
import { useEffect, useMemo } from "react";
import { useQuery } from "urql";

const useTabBarConfigQuery = graphql(/* GraphQL */ `
  query useTabBarConfig {
    activeConfiguration(key: "TAB_BAR_CONFIG") {
      data {
        ...SimpleConfig
      }
    }
    me {
      linkblue
    }
  }
`);

export function useTabBarConfig(): {
  tabConfigLoading: boolean;
  fancyTab: string | undefined;
  shownTabs: string[];
  forceAll: boolean;
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
      Logger.error("Failed to fetch tab bar configuration", {
        error,
        source: "useTabBarConfig",
      });
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
              Logger.warn(
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
                  Logger.warn(
                    `Invalid shownTabs value in tab bar configuration: ${String(
                      tab
                    )}`
                  );
                }
              }
            } else {
              Logger.warn(
                `Invalid shownTabs value in tab bar configuration: ${String(
                  parsed.shownTabs
                )}`
              );
            }
          }
        } else {
          Logger.warn(
            `Invalid allowed tab bar configuration: ${tabBarConfig.value}`
          );
        }
      }
    } catch (error) {
      Logger.error("Failed to parse tab bar configuration", {
        error,
        source: "useTabBarConfig",
      });
    }

    return { fancyTab, shownTabs };
  }, [tabBarConfig]);

  return {
    tabConfigLoading: fetching,
    fancyTab,
    shownTabs,
    forceAll: data?.me?.linkblue === "demo-user",
  };
}

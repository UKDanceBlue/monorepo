import "normalize.css";
import "./root.css";

import { WarningOutlined } from "@ant-design/icons";
import { useNotificationProvider } from "@refinedev/antd";
import type { GoConfig, ParseFunction } from "@refinedev/core";
import { Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { browserTracingIntegration, init } from "@sentry/react";
import {
  createRouter,
  ErrorComponent,
  Link,
  RouterProvider,
} from "@tanstack/react-router";
import type { AuthorizationRule } from "@ukdanceblue/common";
import { App, Empty, Spin } from "antd";
import { App as AntApp } from "antd";
import type { useAppProps } from "antd/es/app/context.js";
import { StrictMode, useEffect, useState } from "react";
import { Provider as UrqlProvider } from "urql";

import { AntConfigProvider, ThemeConfigProvider } from "#config/ant.js";
import { API_BASE_URL, urqlClient } from "#config/api.js";
import { MarathonConfigProvider } from "#config/marathon.js";
import { authProvider } from "#config/refine/authentication.js";
import { dataProvider } from "#config/refine/data.js";
import { SpinningRibbon } from "#elements/components/design/RibbonSpinner.js";

import { routeTree } from "./routeTree.gen.js";

init({
  dsn: "https://f149f5546299b507f5e7b9b4aeafc2f4@o4507762130681856.ingest.us.sentry.io/4508071881932800",
  integrations: [browserTracingIntegration()],
  tracesSampleRate: 0.1,
  tracePropagationTargets: [
    "localhost",
    /^https:\/\/(app|dev)\.danceblue\.org\/(api|graphql)/,
  ],
  enabled: ["https://app.danceblue.org", "https://dev.danceblue.org"].includes(
    window.location.origin
  ),
});

const router = createRouter({
  routeTree,
  defaultPendingComponent: () => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
      }}
    >
      <Spin
        size="large"
        tip="Loading"
        fullscreen
        indicator={<SpinningRibbon size={70} />}
      >
        <div
          style={{
            padding: 64,
            borderRadius: 4,
          }}
        />
      </Spin>
    </div>
  ),
  defaultNotFoundComponent: () => (
    <Empty
      description="Page not found"
      image={
        <WarningOutlined
          style={{
            fontSize: "96px",
            color: "#aa0",
          }}
        />
      }
    />
  ),
  defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
  context: {
    urqlClient,
    antApp: {} as useAppProps,
  },
  defaultPreload: false,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
  interface StaticDataRouteOption {
    authorizationRules: AuthorizationRule[] | null;
  }
}

function RouterWrapper() {
  const [isServerReachable, setIsServerReachable] = useState<
    boolean | undefined
  >(undefined);

  useEffect(() => {
    if (isServerReachable !== undefined) {
      return;
    }

    const timeout = setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (isServerReachable === undefined) {
        setIsServerReachable(false);
      }
    }, 5000);
    fetch(new URL("/api/healthcheck", API_BASE_URL))
      .then(async (res) => {
        clearTimeout(timeout);
        if (res.ok) {
          const text = await res.text();
          setIsServerReachable(text === "OK");
        } else {
          setIsServerReachable(false);
        }
      })
      .catch(() => {
        clearTimeout(timeout);
        setIsServerReachable(false);
      });
  }, [isServerReachable]);

  const antApp = App.useApp();

  return isServerReachable === false ? (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#777",
      }}
    >
      <Empty
        description="Server is not reachable. Contact tech"
        image={
          <WarningOutlined
            style={{
              fontSize: "96px",
              color: "#e33",
            }}
          />
        }
      />
    </div>
  ) : (
    <RouterProvider router={router} context={{ antApp }} />
  );
}

export function Main() {
  return (
    <StrictMode>
      <ThemeConfigProvider>
        <AntConfigProvider>
          <AntApp style={{ height: "100%" }}>
            <UrqlProvider value={urqlClient}>
              <DevtoolsProvider>
                <Refine
                  dataProvider={dataProvider}
                  notificationProvider={useNotificationProvider}
                  routerProvider={{
                    back: () => router.history.back,
                    Link,
                    go: () => refineGoFunction,
                    parse: () => refineParseFunction,
                  }}
                  authProvider={authProvider}
                  options={{
                    projectId: "DqkUbD-wpgLRK-UO3SFV",
                  }}
                >
                  <MarathonConfigProvider>
                    <RouterWrapper />
                  </MarathonConfigProvider>
                  {import.meta.env.MODE === "development" && <DevtoolsPanel />}
                </Refine>
              </DevtoolsProvider>
            </UrqlProvider>
          </AntApp>
        </AntConfigProvider>
      </ThemeConfigProvider>
    </StrictMode>
  );
}

function refineGoFunction({ hash, options, query, to, type }: GoConfig) {
  router
    .navigate({
      to,
      search: options?.keepQuery ? router.state.location.search : query,
      hash: options?.keepHash ? router.state.location.hash : hash,
      replace: type === "replace",
    })
    .catch(console.error);
}

function refineParseFunction(): ReturnType<ParseFunction> {
  const matchesByLength = router.state.matches.toSorted(
    ({ fullPath: fullPathA }, { fullPath: fullPathB }) =>
      String(fullPathB).length - String(fullPathA).length
  );
  const longestMatch = matchesByLength[0];

  let id: string | undefined;
  if (longestMatch) {
    const idParams = Object.keys(longestMatch.params as object).filter((key) =>
      key.toLowerCase().endsWith("id")
    );
    if (idParams.length === 1) {
      id = (longestMatch.params as Record<string, string | undefined>)[
        idParams[0]!
      ];
    }
  }

  return {
    pathname: router.state.location.pathname,
    params: longestMatch?.params,
    id,
  };
}

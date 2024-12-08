import "normalize.css";
import "./root.css";

import { WarningOutlined } from "@ant-design/icons";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { browserTracingIntegration, init } from "@sentry/react";
import {
  createRouter,
  ErrorComponent,
  RouterProvider,
} from "@tanstack/react-router";
import { App, Empty, Spin } from "antd";
import { App as AntApp } from "antd";
import type { useAppProps } from "antd/es/app/context.js";
import { StrictMode, useEffect, useState } from "react";
import { Provider as UrqlProvider } from "urql";

import { AntConfigProvider, ThemeConfigProvider } from "#config/ant.js";
import { API_BASE_URL, urqlClient } from "#config/api.js";
import { MarathonConfigProvider } from "#config/marathon.js";
import { SpinningRibbon } from "#elements/components/design/RibbonSpinner.js";

import { routeTree } from "./routeTree.gen.js";

// @ts-expect-error Avoid an annoying log message from a library
window.process = { env: {} };

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
  Wrap: Context,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
  // interface StaticDataRouteOption {}
}

function Context({ children }: { children: React.ReactNode }) {
  return (
    <ThemeConfigProvider>
      <AntConfigProvider>
        <AntApp style={{ height: "100%" }}>
          <UrqlProvider value={urqlClient}>
            <DevtoolsProvider>
              <MarathonConfigProvider>{children}</MarathonConfigProvider>
            </DevtoolsProvider>
          </UrqlProvider>
        </AntApp>
      </AntConfigProvider>
    </ThemeConfigProvider>
  );
}

function RouterComponent() {
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
    <>
      <RouterProvider router={router} context={{ antApp }} />
      {import.meta.env.MODE === "development" && <DevtoolsPanel />}
    </>
  );
}

export function Main() {
  return (
    <StrictMode>
      <RouterComponent />
    </StrictMode>
  );
}

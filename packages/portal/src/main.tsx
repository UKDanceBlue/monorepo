import "normalize.css";
import "./root.css";

import { WarningOutlined } from "@ant-design/icons";
import { AntConfigProvider, ThemeConfigProvider } from "@config/ant.tsx";
import { API_BASE_URL } from "@config/api.ts";
import { MarathonConfigProvider } from "@config/marathon.tsx";
import { SessionStorageKeys } from "@config/storage";
import { browserTracingIntegration, init } from "@sentry/react";
import { RouterProvider, useAwaited } from "@tanstack/react-router";
import type { AuthorizationRule } from "@ukdanceblue/common";
import { devtoolsExchange } from "@urql/devtools";
import { App, Empty } from "antd";
import { App as AntApp } from "antd";
import { StrictMode, useEffect, useState } from "react";
import type { router } from "router";
import {
  cacheExchange,
  Client,
  fetchExchange,
  Provider as UrqlProvider,
} from "urql";

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

const API_URL = `${API_BASE_URL}/graphql`;
const urqlClient = new Client({
  url: API_URL,
  exchanges: [devtoolsExchange, cacheExchange, fetchExchange],
  fetchOptions: () => {
    // const query = new URLSearchParams(window.location.search).get("masquerade");
    const masquerade = sessionStorage
      .getItem(SessionStorageKeys.Masquerade)
      ?.trim();
    return {
      credentials: "include",
      headers: masquerade
        ? {
            "x-ukdb-masquerade": masquerade,
          }
        : undefined,
    };
  },
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

  const [{ router }] = useAwaited({
    promise: import("./router"),
  });

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
          throw new Error("Server is not reachable");
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

export default function Main() {
  return (
    <StrictMode>
      <ThemeConfigProvider>
        <AntConfigProvider>
          <AntApp style={{ height: "100%" }}>
            <UrqlProvider value={urqlClient}>
              <MarathonConfigProvider>
                <RouterWrapper />
              </MarathonConfigProvider>
            </UrqlProvider>
          </AntApp>
        </AntConfigProvider>
      </ThemeConfigProvider>
    </StrictMode>
  );
}

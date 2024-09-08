import "normalize.css";
import "./root.css";

import { AntConfigProvider, ThemeConfigProvider } from "@config/ant.tsx";
import { API_BASE_URL } from "@config/api.ts";
import { MarathonConfigProvider } from "@config/marathon.tsx";
import {
  createRouter,
  ErrorComponent,
  RouterProvider,
} from "@tanstack/react-router";
import type { AuthorizationRule } from "@ukdanceblue/common";
import { devtoolsExchange } from "@urql/devtools";
import { App, Progress } from "antd";
import { App as AntApp } from "antd";
import type { useAppProps } from "antd/es/app/context";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  cacheExchange,
  Client,
  fetchExchange,
  Provider as UrqlProvider,
} from "urql";

import { routeTree } from "./routeTree.gen";

const API_URL = `${API_BASE_URL}/graphql`;
const urqlClient = new Client({
  url: API_URL,
  exchanges: [devtoolsExchange, cacheExchange, fetchExchange],
  fetchOptions: () => {
    const query = new URLSearchParams(window.location.search).get("masquerade");
    return {
      credentials: "include",
      headers: query
        ? {
            "x-ukdb-masquerade": query,
          }
        : undefined,
    };
  },
});

const router = createRouter({
  routeTree,
  defaultPendingComponent: () => (
    <div className={`p-2 text-2xl`}>
      <Progress />
    </div>
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

// eslint-disable-next-line react-refresh/only-export-components
function RouterWrapper() {
  return <RouterProvider router={router} context={{ antApp: App.useApp() }} />;
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
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

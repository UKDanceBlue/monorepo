import "normalize.css";
import "./root.css";

import { AntConfigProvider, ThemeConfigProvider } from "@config/ant.tsx";
import { API_BASE_URL } from "@config/api.ts";
import { MarathonConfigProvider } from "@config/marathon.tsx";
import { useMarathon } from "@config/marathonContext";
import { useLoginState } from "@hooks/useLoginState";
import {
  createRouter,
  ErrorComponent,
  RouterProvider,
} from "@tanstack/react-router";
import { defaultAuthorization } from "@ukdanceblue/common";
import { Progress } from "antd";
import { App as AntApp } from "antd";
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
  exchanges: [cacheExchange, fetchExchange],
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
    loginState: {
      authorization: defaultAuthorization,
      loggedIn: false,
    },
    selectedMarathon: null,
  },
  defaultPreload: false,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// eslint-disable-next-line react-refresh/only-export-components
function RouterWrapper() {
  const auth = useLoginState();
  const selectedMarathon = useMarathon();

  return (
    <RouterProvider
      router={router}
      context={{ loginState: auth, selectedMarathon }}
    />
  );
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

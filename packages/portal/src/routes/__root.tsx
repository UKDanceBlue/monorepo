import { AntConfigProvider, ThemeConfigProvider } from "@config/ant.tsx";
import { API_BASE_URL } from "@config/api.ts";
import { MarathonConfigProvider } from "@config/marathon.tsx";
import { useMarathon } from "@config/marathonContext";
import { NavigationMenu } from "@elements/singletons/NavigationMenu";
import { useLoginState } from "@hooks/useLoginState";
import {
  createRootRouteWithContext,
  Outlet,
  RouterContextProvider,
  useRouter,
} from "@tanstack/react-router";
import type { Authorization } from "@ukdanceblue/common";
import { Layout } from "antd";
import { App as AntApp } from "antd";
import type { DateTime } from "luxon";
import { lazy, Suspense } from "react";
import {
  cacheExchange,
  Client,
  fetchExchange,
  Provider as UrqlProvider,
} from "urql";

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

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null // Render nothing in production
    : lazy(() =>
        // Lazy load in development
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
          // For Embedded Mode
          // default: res.TanStackRouterDevtoolsPanel
        }))
      );

interface RouterContext {
  auth: {
    loggedIn: boolean | undefined;
    authorization: Authorization | undefined;
  };
  selectedMarathon: {
    id: string;
    year: string;
    startDate: DateTime | null;
    endDate: DateTime | null;
  } | null;
}

function RootComponent() {
  return (
    <RouterContextProvider
      context={{
        auth: useLoginState(),
        selectedMarathon: useMarathon(),
      }}
      router={useRouter()}
    >
      <Layout style={{ height: "100%" }}>
        <Layout.Header>
          <NavigationMenu />
        </Layout.Header>
        <div
          style={{
            overflowY:
              "auto" /* TODO: dark mode , scrollbarColor: "grey black"*/,
          }}
        >
          <Layout.Content style={{ padding: "1vh 15vw" }}>
            <Outlet />
          </Layout.Content>
          <Layout.Footer></Layout.Footer>
        </div>
      </Layout>
      <Suspense>
        <TanStackRouterDevtools position="bottom-right" />
      </Suspense>
    </RouterContextProvider>
  );
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => {
    return (
      <>
        <ThemeConfigProvider>
          <AntConfigProvider>
            <AntApp style={{ height: "100%" }}>
              <UrqlProvider value={urqlClient}>
                <MarathonConfigProvider>
                  <RootComponent />
                </MarathonConfigProvider>
              </UrqlProvider>
            </AntApp>
          </AntConfigProvider>
        </ThemeConfigProvider>
      </>
    );
  },
});

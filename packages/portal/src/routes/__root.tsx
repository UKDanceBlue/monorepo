import { AntConfigProvider, ThemeConfigProvider } from "@config/ant.tsx";
import { API_BASE_URL } from "@config/api.ts";
import { MarathonConfigProvider } from "@config/marathon.tsx";
import { NavigationMenu } from "@elements/singletons/NavigationMenu";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Layout } from "antd";
import { App as AntApp } from "antd";
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

export const Route = createRootRoute({
  component: () => {
    return (
      <>
        <ThemeConfigProvider>
          <AntConfigProvider>
            <AntApp style={{ height: "100%" }}>
              <UrqlProvider value={urqlClient}>
                <MarathonConfigProvider>
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
                </MarathonConfigProvider>
              </UrqlProvider>
            </AntApp>
          </AntConfigProvider>
        </ThemeConfigProvider>
      </>
    );
  },
});

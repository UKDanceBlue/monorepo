import { NavigationMenu } from "@elements/singletons/NavigationMenu";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { PortalAuthData } from "@tools/loginState";
import { routerAuthCheck } from "@tools/routerAuthCheck";
import { Layout } from "antd";
import type { useAppProps } from "antd/es/app/context";
import type { DateTime } from "luxon";
import { lazy, Suspense } from "react";
import type { Client as UrqlClient } from "urql";

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
  loginState: PortalAuthData;
  selectedMarathon: {
    id: string;
    year: string;
    startDate: DateTime | null;
    endDate: DateTime | null;
  } | null;
  urqlClient: UrqlClient;
  antApp: useAppProps;
}

function RootComponent() {
  const { loginState } = Route.useLoaderData();

  return (
    <>
      <Layout style={{ height: "100%" }}>
        <Layout.Header>
          <NavigationMenu auth={loginState} />
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
    </>
  );
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  loader({ context }) {
    console.log("Route.loader", context);
    return { loginState: context.loginState };
  },
  beforeLoad({ context }) {
    routerAuthCheck(Route, context);
  },
  staticData: {
    authorizationRules: null,
  },
});

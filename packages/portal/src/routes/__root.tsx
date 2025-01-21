import type CacheEntity from "@ant-design/cssinjs/es/Cache";
import { Refine } from "@refinedev/core";
import { DevtoolsPanel } from "@refinedev/devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext } from "@tanstack/react-router";
import { notification } from "antd";
import type { useAppProps } from "antd/es/app/context.js";
import { lazy, Suspense } from "react";
import type { Client as UrqlClient } from "urql";

import watermark from "#assets/watermark.svg";
import { authProvider } from "#config/refine/authentication.ts";
import { accessControlProvider } from "#config/refine/authorization.ts";
import { useNotificationProvider } from "#config/refine/feedback.tsx";
import { dataProvider } from "#config/refine/graphql/data.ts";
import { refineResources } from "#config/refine/resources.tsx";
import { routerBindings } from "#config/refine/router.tsx";
import { Main } from "#elements/Main.tsx";
import { refreshLoginState } from "#hooks/useLoginState.js";

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null // Render nothing in production
    : lazy(() =>
        // Lazy load in development
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
        }))
      );

export interface RouterContext {
  urqlClient: UrqlClient;
  antApp: useAppProps;
  cache?: CacheEntity;
}

function RootComponent() {
  // const cache = useMemo<CacheEntity>(() => createCache(), []);

  return (
    <>
      {/* <html lang="en">
      <head>
        <Meta />
        <style
          dangerouslySetInnerHTML={{
            __html: extractStyle(cache, true),
          }}
        />
      </head>
      <body> */}
      {/* <StyleProvider cache={cache}> */}
      <Main />
      {/* </StyleProvider> */}
      <Suspense>
        <TanStackRouterDevtools position="bottom-right" />
        <ReactQueryDevtools initialIsOpen={false} position="right" />
        <DevtoolsPanel />
      </Suspense>
      {/* <Scripts />
      </body>
    </html> */}
    </>
  );
}

function RootWithRefine() {
  return (
    <Refine
      dataProvider={dataProvider}
      notificationProvider={useNotificationProvider}
      routerProvider={routerBindings}
      authProvider={authProvider}
      options={{
        projectId: "DqkUbD-wpgLRK-UO3SFV",
        title: {
          icon: <img src={watermark} alt="DanceBlue Logo" />,
          text: "DanceBlue Portal",
        },
        mutationMode: "optimistic",
        disableTelemetry: true,
        redirect: {
          afterCreate: "show",
          afterEdit: "show",
        },
        syncWithLocation: true,
        warnWhenUnsavedChanges: true,
        disableServerSideValidation: true,
        liveMode: "off",
      }}
      accessControlProvider={accessControlProvider}
      resources={refineResources}
    >
      <RootComponent />
    </Refine>
  );
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootWithRefine,
  beforeLoad: async ({ context }) => {
    const loginState = await refreshLoginState(context.urqlClient);
    loginState.mapErr((error) =>
      notification.error({ message: String(error) })
    );
  },
  // head: () => {
  //   return {
  //     meta: [
  //       {
  //         title: "DB Admin Portal",
  //       },
  //       {
  //         // eslint-disable-next-line unicorn/text-encoding-identifier-case
  //         charSet: "UTF-8",
  //       },
  //       {
  //         name: "viewport",
  //         content: "width=device-width, initial-scale=1.0",
  //       },
  //       {
  //         name: "msapplication-TileImage",
  //         content: "/assets/watermark-512.png",
  //       },
  //     ],
  //     links: [
  //       {
  //         rel: "icon",
  //         href: "/assets/watermark-256.png",
  //         sizes: "256x256",
  //       },
  //       {
  //         rel: "icon",
  //         href: "/assets/watermark-512.png",
  //         sizes: "512x512",
  //       },
  //       {
  //         rel: "icon",
  //         type: "image/svg+xml",
  //         href: "/assets/watermark.svg",
  //       },
  //     ],
  //     scripts: [
  //       {
  //         type: "module",
  //         children: `import RefreshRuntime from "/@react-refresh"
  //       RefreshRuntime.injectIntoGlobalHook(window)
  //       window.$RefreshReg$ = () => {}
  //       window.$RefreshSig$ = () => (type) => type
  //       window.__vite_plugin_react_preamble_installed__ = true`,
  //       },
  //       {
  //         type: "module",
  //         src: "/@vite/client",
  //       },
  //       {
  //         type: "module",
  //         src: "/src/entry-client.tsx",
  //       },
  //     ],
  //   };
  // },
});

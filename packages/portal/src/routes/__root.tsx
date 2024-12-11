import { SettingOutlined } from "@ant-design/icons";
import { AuthPage, useNotificationProvider } from "@refinedev/antd";
import { Refine, useLogin } from "@refinedev/core";
import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";
import {
  Button,
  ConfigProvider,
  Divider,
  Layout,
  notification,
  Space,
} from "antd";
import type { useAppProps } from "antd/es/app/context.js";
import { lazy, Suspense, useState } from "react";
import type { Client as UrqlClient } from "urql";

import watermark from "#assets/watermark.svg";
import { authProvider } from "#config/refine/authentication.ts";
import { accessControlProvider } from "#config/refine/authorization.ts";
import { dataProvider } from "#config/refine/graphql/data.ts";
import { refineResources } from "#config/refine/resources.tsx";
import { routerBindings } from "#config/refine/router.tsx";
import { StorageManager, useStorageValue } from "#config/storage.ts";
import { Sider } from "#elements/components/sider/index.tsx";
import { ConfigModal } from "#elements/singletons/ConfigModal.tsx";
import { refreshLoginState, useLoginState } from "#hooks/useLoginState.js";

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
  urqlClient: UrqlClient;
  antApp: useAppProps;
}

function RootComponent() {
  const { loggedIn } = useLoginState();
  const { mutate: login } = useLogin();
  const masquerading =
    useStorageValue(StorageManager.Local, StorageManager.keys.masquerade)[0] !==
    null;

  const [settingsOpen, setSettinsOpen] = useState(false);

  if (!loggedIn) {
    return (
      <ConfigProvider form={{ variant: "filled" }}>
        <AuthPage
          forgotPasswordLink={false}
          registerLink={false}
          title={
            <img
              src={watermark}
              alt="DanceBlue Logo"
              style={{ width: "30ch" }}
            />
          }
          formProps={{
            layout: "horizontal",
          }}
          contentProps={{
            styles: {
              body: { margin: "0" },
            },
            style: {
              padding: "0 32px",
              maxWidth: "80ch",
              margin: "auto",
              boxShadow:
                "rgba(0, 0, 0, 0.02) 0px 2px 4px, rgba(0, 0, 0, 0.02) 0px 1px 6px -1px, rgba(0, 0, 0, 0.03) 0px 1px 2px",
              backgroundColor: "rgb(244, 252, 255)",
            },
            cover: (
              <Space
                direction="vertical"
                size="large"
                style={{ width: "100%" }}
              >
                <p style={{ textAlign: "justify" }}>
                  If you do not recognize this page, you may be looking for the{" "}
                  <a href="https://www.danceblue.org">DanceBlue website</a>{" "}
                  instead.
                </p>
                <Button
                  onClick={() => login({ linkblue: true })}
                  type="primary"
                  style={{ width: "100%", marginBottom: "1ch" }}
                >
                  Log In with Linkblue
                </Button>
                <Divider>OR</Divider>
              </Space>
            ),
          }}
        />
      </ConfigProvider>
    );
  }

  return (
    <>
      <Layout style={{ height: "100%" }}>
        <ConfigProvider
          theme={{
            components: {
              Select: {
                colorText: "rgba(255, 255, 255, 0.65)",
                colorIcon: "rgba(255, 255, 255, 0.65)",
              },
            },
          }}
        >
          <Sider
            Title={() => (
              <Link to="/">
                <img
                  src={watermark}
                  alt="DanceBlue Logo"
                  style={{ width: "100%" }}
                />
              </Link>
            )}
            getItems={({ items, logout }) => [
              ...items,
              {
                key: "settings",
                icon: <SettingOutlined />,
                onClick: () => setSettinsOpen(true),
                label: "Settings",
              },
              ...(logout ? [logout] : []),
            ]}
          />
        </ConfigProvider>
        <Layout>
          {masquerading && (
            <div
              style={{
                background: "rgba(255, 0, 0, 0.5)",
                padding: "1ch",
                width: "100%",
                textAlign: "center",
              }}
            >
              You are currently masquerading as another user
            </div>
          )}
          <Layout.Content style={{ padding: "1vh 3vw", overflowY: "scroll" }}>
            <Outlet />
          </Layout.Content>
        </Layout>
      </Layout>
      <Suspense>
        <TanStackRouterDevtools position="bottom-right" />
        <ConfigModal
          open={settingsOpen}
          onClose={() => setSettinsOpen(false)}
        />
      </Suspense>
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
  staticData: {
    authorizationRules: null,
  },
});

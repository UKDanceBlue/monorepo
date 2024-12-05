import { MoonOutlined, SettingOutlined, SunOutlined } from "@ant-design/icons";
import { AuthPage } from "@refinedev/antd";
import { useLogin } from "@refinedev/core";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { Button, ConfigProvider, Layout, Menu } from "antd";
import type { useAppProps } from "antd/es/app/context.js";
import { lazy, Suspense, useContext, useState } from "react";
import type { Client as UrqlClient } from "urql";

import watermark from "#assets/watermark.svg";
import { themeConfigContext } from "#config/antThemeConfig.ts";
import { Sider } from "#elements/components/sider/index.tsx";
import { ConfigModal } from "#elements/singletons/NavigationMenu.tsx";
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
  const { dark, setDark } = useContext(themeConfigContext);

  const [settingsOpen, setSettinsOpen] = useState(false);

  if (!loggedIn) {
    return (
      <AuthPage
        forgotPasswordLink={false}
        registerLink={false}
        title={
          <img src={watermark} alt="DanceBlue Logo" style={{ width: "30ch" }} />
        }
        hideForm
        contentProps={{
          cover: (
            <div style={{ padding: "1ch" }}>
              <Button
                onClick={() => login({})}
                type="primary"
                style={{ width: "100%", marginBottom: "1ch" }}
              >
                Log In
              </Button>
              <p style={{ textAlign: "justify" }}>
                If you do not recognize this page, you may be looking for the{" "}
                <a href="https://www.danceblue.org">DanceBlue website</a>{" "}
                instead.
              </p>
            </div>
          ),
        }}
      />
    );
  }

  return (
    <>
      <Layout style={{ height: "100%" }}>
        <Sider
          Title={() => (
            <img
              src={watermark}
              alt="DanceBlue Logo"
              style={{ width: "100%" }}
            />
          )}
          render={({ items, logout }) => (
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
              {items}
              <Menu.Item
                key="settings"
                icon={<SettingOutlined />}
                onClick={() => setSettinsOpen(true)}
              >
                Settings
              </Menu.Item>
              <Menu.Item
                key="theme"
                icon={
                  dark ? (
                    <SunOutlined style={{ color: "inherit" }} />
                  ) : (
                    <MoonOutlined style={{ color: "inherit" }} />
                  )
                }
                onClick={() => setDark(!dark)}
              >
                {dark ? "Light" : "Dark"} Theme
              </Menu.Item>
              {logout}
            </ConfigProvider>
          )}
        />
        <Layout.Content style={{ padding: "1vh 3vw", overflowY: "scroll" }}>
          <Outlet />
        </Layout.Content>
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

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  beforeLoad: async ({ context }) => {
    await refreshLoginState(context.urqlClient);
  },
  staticData: {
    authorizationRules: null,
  },
});

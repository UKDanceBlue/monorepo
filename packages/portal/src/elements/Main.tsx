import { SettingOutlined } from "@ant-design/icons";
import { AuthPage } from "@refinedev/antd";
import { Link, Outlet } from "@tanstack/react-router";
import { ConfigProvider, Layout, Space } from "antd";
import { App as AntApp } from "antd";
import { useState } from "react";

import UKYLogo from "#assets/uky-logo-128.png";
import watermark from "#assets/watermark.svg";
import { StorageManager, useStorageValue } from "#config/storage.ts";
import { Sider } from "#elements/components/sider/index.tsx";
import { ConfigModal } from "#elements/singletons/ConfigModal.tsx";
import { useLoginState } from "#hooks/useLoginState.js";

export function Main() {
  const { loggedIn } = useLoginState();
  const masquerading =
    useStorageValue(StorageManager.Local, StorageManager.keys.masquerade)[0] !==
    null;

  const [settingsOpen, setSettinsOpen] = useState(false);

  let content;
  if (!loggedIn) {
    content = (
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
              </Space>
            ),
          }}
          providers={[
            {
              name: "Linkblue",
              label: "Log In with Linkblue",
              icon: (
                <img
                  src={UKYLogo}
                  height="2em"
                  width="2em"
                  style={{
                    height: "2em",
                    width: "2em",
                  }}
                />
              ),
            },
          ]}
          rememberMe={false}
        />
      </ConfigProvider>
    );
  } else {
    content = (
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
    );
  }

  return (
    <>
      <AntApp style={{ height: "100%" }}>
        {content}
        <ConfigModal
          open={settingsOpen}
          onClose={() => setSettinsOpen(false)}
        />
      </AntApp>
    </>
  );
}

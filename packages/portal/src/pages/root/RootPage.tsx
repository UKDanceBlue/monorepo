import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Layout } from "antd";

import { NavigationMenu } from "../../elements/singletons/NavigationMenu";

export const RootPage = () => {
  return (
    <>
      <Layout>
        <Layout.Header>
          <NavigationMenu />
        </Layout.Header>
        <Layout.Content style={{ padding: "0 5vw" }}>
          <Outlet />
        </Layout.Content>
        <Layout.Footer></Layout.Footer>
      </Layout>
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
};

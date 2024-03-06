import { Outlet } from "@tanstack/react-router";
import { Layout } from "antd";

import { NavigationMenu } from "../../elements/singletons/NavigationMenu";

export const RootPage = () => {
  return (
    <>
      <Layout style={{ height: "100%" }}>
        <Layout.Header>
          <NavigationMenu />
        </Layout.Header>
        <Layout.Content style={{ padding: "1vh 15vw" }}>
          <Outlet />
        </Layout.Content>
        <Layout.Footer></Layout.Footer>
      </Layout>
    </>
  );
};

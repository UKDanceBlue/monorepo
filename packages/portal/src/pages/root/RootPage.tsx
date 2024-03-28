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
    </>
  );
};

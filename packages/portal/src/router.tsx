import { WarningOutlined } from "@ant-design/icons";
import { SpinningRibbon } from "@elements/components/design/RibbonSpinner";
import { createRouter, ErrorComponent } from "@tanstack/react-router";
import { Empty, Spin } from "antd";
import type { useAppProps } from "antd/es/app/context";
import { routeTree } from "routeTree.gen";
import type { Client as UrqlClient } from "urql";

export const router = createRouter({
  routeTree,
  defaultPendingComponent: () => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
      }}
    >
      <Spin
        size="large"
        tip="Loading"
        fullscreen
        indicator={<SpinningRibbon size={70} />}
      >
        <div
          style={{
            padding: 64,
            borderRadius: 4,
          }}
        />
      </Spin>
    </div>
  ),
  defaultNotFoundComponent: () => (
    <Empty
      description="Page not found"
      image={
        <WarningOutlined
          style={{
            fontSize: "96px",
            color: "#aa0",
          }}
        />
      }
    />
  ),
  defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
  context: {
    urqlClient: {} as UrqlClient,
    antApp: {} as useAppProps,
  },
  defaultPreload: false,
});

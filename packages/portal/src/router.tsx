import { createCache } from "@ant-design/cssinjs";
import { createRouter as createTanstackRouter } from "@tanstack/react-router";
import { Result, Spin } from "antd";
import type { useAppProps } from "antd/es/app/context";

import { urqlClient } from "#config/api.js";
import { LoadingRibbon } from "#elements/components/design/RibbonSpinner.js";
import { InnerContext, OuterContext } from "#elements/Context.js";

import { routeTree } from "./routeTree.gen.js";
import { transformer } from "./transformer.js";

if (typeof window !== "undefined") {
  // @ts-expect-error Avoid an annoying log message from a library
  window.process = { env: {} };
}

export function createRouter() {
  return createTanstackRouter({
    routeTree,
    transformer: {
      stringify(obj) {
        return transformer.stringify(obj);
      },
      parse(str) {
        return transformer.parse(str);
      },
      encode(value) {
        return value;
      },
      decode(value) {
        return value;
      },
    },
    Wrap: OuterContext,
    InnerWrap: InnerContext,
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
          tip="Connecting to server..."
          fullscreen
          indicator={<LoadingRibbon size={96} />}
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
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
      />
    ),
    defaultErrorComponent: ({ error }) => (
      <Result title={error.name} subTitle={error.message} status="error" />
    ),

    context: {
      urqlClient,
      antApp: {} as useAppProps,
      cache: createCache(),
    },
    defaultPreload: false,
  });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}

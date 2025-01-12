import { createRouter as createTanstackRouter } from "@tanstack/react-router";
import { Result, Spin } from "antd";
import type { useAppProps } from "antd/es/app/context";
import { DateTime, Duration, Interval } from "luxon";
import { registerCustom, SuperJSON } from "superjson";

import { urqlClient } from "#config/api.js";
import { LoadingRibbon } from "#elements/components/design/RibbonSpinner.js";

import { MainContext } from "./main.js";
import { routeTree } from "./routeTree.gen.js";

const transformer = new SuperJSON();
registerCustom<DateTime, string>(
  {
    isApplicable(v) {
      return DateTime.isDateTime(v);
    },
    serialize(v: DateTime) {
      if (v.isValid) {
        return (v as DateTime<true>).toISO();
      }
      throw new Error("Invalid DateTime");
    },
    deserialize(v: string) {
      return DateTime.fromISO(v);
    },
  },
  "DateTime"
);
registerCustom<Duration, string>(
  {
    isApplicable(v) {
      return Duration.isDuration(v);
    },
    serialize(v: Duration) {
      if (v.isValid) {
        return (v as Duration<true>).toISO();
      }
      throw new Error("Invalid Duration");
    },
    deserialize(v: string) {
      return Duration.fromISO(v);
    },
  },
  "Duration"
);
registerCustom<Interval, string>(
  {
    isApplicable(v) {
      return Interval.isInterval(v);
    },
    serialize(v: Interval) {
      if (v.isValid) {
        return (v as Interval<true>).toISO();
      }
      throw new Error("Invalid Interval");
    },
    deserialize(v: string) {
      return Interval.fromISO(v);
    },
  },
  "Interval"
);

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
      head: "",
    },
    defaultPreload: false,
    Wrap: MainContext,
  });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}

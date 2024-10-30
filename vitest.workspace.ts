import { defineWorkspace } from "vitest/config";
// @ts-ignore
import { literalConfig as portalConfig } from "./packages/portal/vite.config.ts";

export default defineWorkspace([
  {
    root: "packages/common/lib",
    test: {
      alias: {
        "type-graphql": "type-graphql/shim",
      },
    },
  },
  {
    root: "packages/server/src",
    test: {
      env: {
        NODE_ENV: "test",
      },
    },
  },
  {
    ...portalConfig,
    root: "packages/portal",
    test: {
      environment: "happy-dom",
    },
  },
]);

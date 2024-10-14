import { defineWorkspace } from "vitest/config";

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
]);

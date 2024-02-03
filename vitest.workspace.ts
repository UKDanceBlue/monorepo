import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  {
    root: "packages/common/lib",
    test: {
      alias: {
        "type-graphql": "type-graphql/browser-shim.js",
      },
    },
  },
]);

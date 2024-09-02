import type { IGraphQLConfig } from "graphql-config";

const config: IGraphQLConfig = {
  projects: {
    portal: {
      schema: "./schema.graphql",
      documents: "./packages/portal/src/**/*.{graphql,js,ts,jsx,tsx}",
    },
    mobile: {
      schema: "./schema.graphql",
      documents: "./packages/mobile/src/**/*.{graphql,js,ts,jsx,tsx}",
    },
  },
};

export default config;
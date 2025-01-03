// import { dirname, resolve } from "node:path";
// import { fileURLToPath } from "node:url";

import { sentryVitePlugin } from "@sentry/vite-plugin";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react-swc";
import type { UserConfig } from "vite";
import { defineConfig } from "vite";

// const __dirname = dirname(fileURLToPath(import.meta.url));

// function resolveRelative(...relativePath: string[]) {
//   return resolve(__dirname, ...relativePath);
// }

export const literalConfig: UserConfig = {
  resolve: {
    alias: {
      "type-graphql": "type-graphql/shim",
    },
  },
  server: {
    watch: {
      usePolling: true,
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    sourcemap: true,
  },
  plugins: [
    TanStackRouterVite({
      quoteStyle: "double",
      semicolons: true,
    }),
    react(),
    sentryVitePlugin({
      org: "ukdanceblue",
      project: "portal",
      disable: process.env.NODE_ENV !== "production",
    }),
  ],
};

// https://vitejs.dev/config/
export default defineConfig(literalConfig);

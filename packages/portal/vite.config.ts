import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { sentryVitePlugin } from "@sentry/vite-plugin";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

function resolveRelative(...relativePath: string[]) {
  return resolve(__dirname, ...relativePath);
}

export const literalConfig = {
  resolve: {
    alias: {
      "type-graphql": "type-graphql/shim",
      "#config": resolveRelative("src", "config"),
      "#elements": resolveRelative("src", "elements"),
      "#hooks": resolveRelative("src", "hooks"),
      "#pages": resolveRelative("src", "pages"),
      "#routing": resolveRelative("src", "routing"),
      "#tools": resolveRelative("src", "tools"),
      "#documents": resolveRelative("src", "documents"),
      "#assets": resolveRelative("assets"),
      "#graphql": resolveRelative("graphql"),
      "#mocks": resolveRelative("mocks"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          common: ["@ukdanceblue/common"],
        },
      },
    },
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

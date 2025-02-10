import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { sentryVitePlugin } from "@sentry/vite-plugin";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react-swc";
import type { UserConfig } from "vite";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const literalConfig = {
  root: __dirname,
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
    chunkSizeWarningLimit: 2000,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          antd: ["antd"],
          refine: ["@refinedev/core", "@refinedev/antd"],
        },
      },
    },
  },

  plugins: [
    TanStackRouterVite({
      quoteStyle: "double",
      semicolons: true,
      autoCodeSplitting: true,
    }),
    react(),
    sentryVitePlugin({
      org: "ukdanceblue",
      project: "portal",
      disable: process.env.NODE_ENV !== "production",
    }),
  ],
  ssr: {
    optimizeDeps: {},
    noExternal: [
      "antd",
      /^@ant-design/,
      /^rc-/,
      /^@emoji-mart/,
      /^@emotion/,
      /^@rc-component/,
      "lexical",
      /^@lexical/,
      /^@mdxeditor/,
      /@nivo/,
    ],
  },
} satisfies UserConfig;

// https://vitejs.dev/config/
export default defineConfig(literalConfig);

import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

function resolveRelative(...relativePath: string[]) {
  return resolve(__dirname, ...relativePath);
}

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "type-graphql": "type-graphql/shim",
      "@config": resolveRelative("src", "config"),
      "@elements": resolveRelative("src", "elements"),
      "@hooks": resolveRelative("src", "hooks"),
      "@pages": resolveRelative("src", "pages"),
      "@routing": resolveRelative("src", "routing"),
      "@tools": resolveRelative("src", "tools"),
      "@documents": resolveRelative("src", "documents"),
      "@assets": resolveRelative("assets"),
    },
  },

  plugins: [
    react(),
    TanStackRouterVite({
      quoteStyle: "double",
      semicolons: true,
    }),
  ],
});

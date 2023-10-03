import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "type-graphql-browser-shim",
      resolveId(source) {
        if (source === "type-graphql") {
          return "type-graphql/dist/browser-shim.js";
        }
      },
    },
  ],
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    // alias: {
    //   "type-graphql": "type-graphql/dist/browser-shim.js",
    // },
  },
  plugins: [react()],
});

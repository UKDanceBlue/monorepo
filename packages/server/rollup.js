import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('rollup').RollupOptions} */
export default {
  input: "src/index.ts",
  output: {
    dir: "dist",
    format: "es",
    generatedCode: "es2015",
    sourcemap: true,
  },
  plugins: [
    typescript({
      tsconfig: resolve(__dirname, "tsconfig.json"),
      sourceMap: true,
    }),
    commonjs(),
    nodeResolve(),
    json(),
  ],
};

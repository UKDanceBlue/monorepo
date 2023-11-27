import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import("rollup").GetManualChunk} */
function manualChunks(id, { getModuleInfo }) {
  const moduleInfo = getModuleInfo(id);
  if (
    moduleInfo?.importers.some((importer) =>
      importer.includes("@ukdanceblue/common")
    )
  ) {
    return "common";
  }
  if (id.includes("node_modules")) {
    let afterNodeModules = id.split("node_modules")[1];
    let separator = "/";
    if (afterNodeModules.startsWith("/")) {
      separator = "/";
    } else if (afterNodeModules.startsWith("\\")) {
      separator = "\\";
    } else {
      throw new Error("Unexpected separator");
    }
    afterNodeModules = afterNodeModules.slice(1);
    const [moduleName, secondName] = afterNodeModules.split(separator);
    if (moduleName.startsWith("@")) {
      return `${moduleName}/${secondName}`;
    }
    return moduleName;
  }
}

/** @type {import('rollup').RollupOptions} */
export default {
  input: "src/index.ts",
  output: {
    dir: "dist",
    format: "esm",
    sourcemap: true,
    manualChunks,
  },
  plugins: [
    typescript({
      tsconfig: resolve(__dirname, "tsconfig.json"),
      sourceMap: true,
      outputToFilesystem: true,
    }),
    commonjs(),
    nodeResolve({
      preferBuiltins: true,
    }),
    json(),
  ],
  treeshake: "safest",
  onLog(level, message, defaultLogger) {
    // Ignore invalid annotations from graphql-scalars
    if (
      message.code === "INVALID_ANNOTATION" &&
      message.message.startsWith("A comment\n\n") &&
      message.id?.includes("graphql-scalars")
    ) {
      return;
    }
    // Ignore eval errors from protobufjs and depd
    // protobufjs: Just a dumb check for 'require'
    // depd: Used to wrap functions, so it is insecure,
    // but doesn't pollute the global scope so oh well
    if (
      message.code === "EVAL" &&
      (message.id?.includes("protobufjs") || message.id?.includes("depd"))
    ) {
      return;
    }
    // Ignore undefined errors from class-validator and object-types
    if (
      message.code === "THIS_IS_UNDEFINED" &&
      (message.id?.includes("class-validator") ||
        message.id?.includes("object-types"))
    ) {
      return;
    }
    // Ignore any circular dependency errors from dependencies
    if (
      message.code === "CIRCULAR_DEPENDENCY" &&
      message.ids?.every((id) => id.includes("node_modules"))
    ) {
      return;
    }
    defaultLogger(level, message);
  },
};

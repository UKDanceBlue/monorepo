import { Linter } from "eslint";
import baseConfig from "./base.js";
import packagesConfig from "./packages.js";
import typescriptConfig from "./typescript.js";

export default [
  ...baseConfig,
  ...typescriptConfig,
  ...packagesConfig,
] satisfies Linter.FlatConfig[];

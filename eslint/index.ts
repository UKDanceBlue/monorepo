import type { Linter } from "eslint";

import baseConfig from "./base.js";
import packagesConfig from "./packages.js";
import typescriptConfig from "./typescript.js";
import vitestConfig from "./vitest.js";

export default [
  ...baseConfig,
  ...typescriptConfig,
  ...packagesConfig,
  vitestConfig,
] satisfies Linter.FlatConfig[];

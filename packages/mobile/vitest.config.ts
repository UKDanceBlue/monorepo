import { join } from "path";

import type { UserProjectConfigExport } from "vitest/config";
import { mergeConfig } from "vitest/config";

import { configShared } from "../../vitest.shared.js";

const libDir = join(__dirname, "src");

export default mergeConfig<UserProjectConfigExport, UserProjectConfigExport>(
  configShared,
  {
    root: libDir,
    test: {},
  }
);

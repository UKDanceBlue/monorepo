import { dirname, join } from "path";
import { fileURLToPath } from "url";

import type { UserProjectConfigExport } from "vitest/config";
import { mergeConfig } from "vitest/config";

import { configShared } from "../../vitest.shared.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const libDir = join(__dirname, "src");

export default mergeConfig<UserProjectConfigExport, UserProjectConfigExport>(
  configShared,
  {
    root: libDir,
    test: {
      environment: "jsdom",
    },
  }
);

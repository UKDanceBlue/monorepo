import "reflect-metadata";

import { logDirToken, loggingLevelToken } from "#lib/typediTokens.js";
import { expressToken } from "#routes/expressToken.js";

// No top level imports that cause side effects should be used in this file
// We want to control the order of execution

await import("#environment");
await import("#lib/prisma.js");

import { URL } from "url";

import { SyslogLevels } from "#logging/standardLogging.ts";

declare global {
  declare type URL = URL;
}

// declare module "express-session" {
//   interface SessionData {
//   }
// }

export {};

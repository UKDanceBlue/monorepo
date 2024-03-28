import { SyslogLevels } from "./lib/logging/standardLogging.ts";

declare global {
  namespace NodeJS {
    interface ProcessEnvironment {
      NODE_ENV?: "development" | "production";
      APPLICATION_PORT?: string;
      APPLICATION_HOST?: string;

      ASSET_PATH?: string;

      COOKIE_SECRET?: string;
      JWT_SECRET?: string;

      DB_HOST?: string;
      DB_PORT?: string;
      DB_UNAME?: string;
      DB_PWD?: string;
      DB_NAME?: string;

      // These don't need to be optional because they are checked in index.ts
      MS_OIDC_URL?: string;
      MS_CLIENT_ID?: string;
      MS_CLIENT_SECRET?: string;

      LOGGING_LEVEL?: SyslogLevels;

      EXPO_ACCESS_TOKEN?: string;

      // If "THIS IS DANGEROUS" is set, then the app will bypass auth checks and grand admin rights to all connections
      OVERRIDE_AUTH?: string;
    }
  }
}

// declare module "express-session" {
//   interface SessionData {
//   }
// }

export {};

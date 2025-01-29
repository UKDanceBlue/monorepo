// This file is first imported by index.ts

import { Container, Token } from "@freshgum/typedi";
import type { PrismaClient } from "@prisma/client";

import type { SyslogLevels } from "./logging/SyslogLevels.js";

// These are all of the environment variables that the server uses
export const loggingLevelToken = new Token<SyslogLevels>("LOGGING_LEVEL");
export const applicationPortToken = new Token<number>("APPLICATION_PORT");
export const cookieSecretToken = new Token<string>("COOKIE_SECRET");
export const jwtSecretToken = new Token<string>("JWT_SECRET");
export const instagramApiKeyToken = new Token<string>("INSTAGRAM_API_KEY");
export const msOidcUrlToken = new Token<URL>("MS_OIDC_URL");
export const msClientIdToken = new Token<string>("MS_CLIENT_ID");
export const msClientSecretToken = new Token<string>("MS_CLIENT_SECRET");
export const dbFundsEnabledToken = new Token<boolean>("DBFUNDS_ENABLED");
export const dbFundsApiKeyToken = new Token<string | undefined>(
  "DBFUNDS_API_KEY"
);
export const dbFundsApiOriginToken = new Token<string | undefined>(
  "DBFUNDS_API_ORIGIN"
);
export const maxFileSizeToken = new Token<number>("MAX_FILE_SIZE");
export const servePathToken = new Token<string>("SERVE_PATH");
export const uploadPathToken = new Token<string>("UPLOAD_PATH");
export const logDirToken = new Token<string>("LOG_DIR");
export const superAdminLinkbluesToken = new Token<string[] | symbol>(
  "SUPER_ADMIN_LINKBLUE"
);
export const isDevelopmentToken = new Token<boolean>("IS_DEVELOPMENT");
export const isReplToken = new Token<boolean>("IS_REPL");

export interface Environment {
  loggingLevel: SyslogLevels;
  applicationPort: number;
  cookieSecret: string;
  jwtSecret: string;
  instagramApiKey: string;
  msOidcUrl: URL;
  msClientId: string;
  msClientSecret: string;
  dbFundsEnabled: boolean;
  dbFundsApiKey?: string;
  dbFundsApiOrigin?: string;
  maxFileSize: number;
  servePath: string;
  uploadPath: string;
  logDir: string;
  superAdminLinkblues: string[] | symbol;
  isDevelopmentToken: boolean;
  isRepl: boolean;
}

export function setEnvironment(env: Environment) {
  Container.setValue(loggingLevelToken, env.loggingLevel);
  Container.setValue(applicationPortToken, env.applicationPort);
  Container.setValue(cookieSecretToken, env.cookieSecret);
  Container.setValue(jwtSecretToken, env.jwtSecret);
  Container.setValue(instagramApiKeyToken, env.instagramApiKey);
  Container.setValue(msOidcUrlToken, env.msOidcUrl);
  Container.setValue(msClientIdToken, env.msClientId);
  Container.setValue(msClientSecretToken, env.msClientSecret);
  Container.setValue(dbFundsEnabledToken, env.dbFundsEnabled);
  Container.setValue(
    dbFundsApiKeyToken,
    env.dbFundsEnabled ? env.dbFundsApiKey : undefined
  );
  Container.setValue(
    dbFundsApiOriginToken,
    env.dbFundsEnabled ? env.dbFundsApiOrigin : undefined
  );
  Container.setValue(maxFileSizeToken, env.maxFileSize);
  Container.setValue(servePathToken, env.servePath);
  Container.setValue(uploadPathToken, env.uploadPath);
  Container.setValue(logDirToken, env.logDir);
  Container.setValue(superAdminLinkbluesToken, env.superAdminLinkblues);
  Container.setValue(isDevelopmentToken, env.isDevelopmentToken);
  Container.setValue(isReplToken, env.isRepl);
}

export function getEnvironment(): Environment {
  return {
    loggingLevel: Container.get(loggingLevelToken),
    applicationPort: Container.get(applicationPortToken),
    cookieSecret: Container.get(cookieSecretToken),
    jwtSecret: Container.get(jwtSecretToken),
    instagramApiKey: Container.get(instagramApiKeyToken),
    msOidcUrl: Container.get(msOidcUrlToken),
    msClientId: Container.get(msClientIdToken),
    msClientSecret: Container.get(msClientSecretToken),
    dbFundsEnabled: Container.get(dbFundsEnabledToken),
    dbFundsApiKey: Container.get(dbFundsApiKeyToken),
    dbFundsApiOrigin: Container.get(dbFundsApiOriginToken),
    maxFileSize: Container.get(maxFileSizeToken),
    servePath: Container.get(servePathToken),
    uploadPath: Container.get(uploadPathToken),
    logDir: Container.get(logDirToken),
    superAdminLinkblues: Container.get(superAdminLinkbluesToken),
    isDevelopmentToken: Container.get(isDevelopmentToken),
    isRepl: Container.get(isReplToken),
  };
}
export const prismaToken = new Token<PrismaClient>("PrismaClient");

// This file is first imported by index.ts

import { Container, Token } from "@freshgum/typedi";

import type { SyslogLevels } from "./logging/SyslogLevels.js";

// These are all of the environment variables that the server uses
export const loggingLevelToken = new Token<SyslogLevels>("LOGGING_LEVEL");
export const applicationPortToken = new Token<number>("APPLICATION_PORT");
export const cookieSecretToken = new Token<string>("COOKIE_SECRET");
export const jwtSecretToken = new Token<string>("JWT_SECRET");
export const msOidcUrlToken = new Token<URL>("MS_OIDC_URL");
export const msClientIdToken = new Token<string>("MS_CLIENT_ID");
export const msClientSecretToken = new Token<string>("MS_CLIENT_SECRET");
export const dbFundsApiKeyToken = new Token<string>("DBFUNDS_API_KEY");
export const dbFundsApiOriginToken = new Token<string>("DBFUNDS_API_ORIGIN");
export const serveOriginToken = new Token<string>("SERVE_ORIGIN");
export const maxFileSizeToken = new Token<number>("MAX_FILE_SIZE");
export const servePathToken = new Token<string>("SERVE_PATH");
export const uploadPathToken = new Token<string>("UPLOAD_PATH");
export const logDirToken = new Token<string>("LOG_DIR");
export const superAdminLinkbluesToken = new Token<string[] | symbol>(
  "SUPER_ADMIN_LINKBLUE"
);
export const isDevelopmentToken = new Token<boolean>("IS_DEVELOPMENT");

export interface Environment {
  loggingLevel: SyslogLevels;
  applicationPort: number;
  cookieSecret: string;
  jwtSecret: string;
  msOidcUrl: URL;
  msClientId: string;
  msClientSecret: string;
  dbFundsApiKey: string;
  dbFundsApiOrigin: string;
  serveOrigin: string;
  maxFileSize: number;
  servePath: string;
  uploadPath: string;
  logDir: string;
  superAdminLinkblues: string[] | symbol;
  isDevelopmentToken: boolean;
}

export function setEnvironment(env: Environment) {
  Container.setValue(loggingLevelToken, env.loggingLevel);
  Container.setValue(applicationPortToken, env.applicationPort);
  Container.setValue(cookieSecretToken, env.cookieSecret);
  Container.setValue(jwtSecretToken, env.jwtSecret);
  Container.setValue(msOidcUrlToken, env.msOidcUrl);
  Container.setValue(msClientIdToken, env.msClientId);
  Container.setValue(msClientSecretToken, env.msClientSecret);
  Container.setValue(dbFundsApiKeyToken, env.dbFundsApiKey);
  Container.setValue(dbFundsApiOriginToken, env.dbFundsApiOrigin);
  Container.setValue(serveOriginToken, env.serveOrigin);
  Container.setValue(maxFileSizeToken, env.maxFileSize);
  Container.setValue(servePathToken, env.servePath);
  Container.setValue(uploadPathToken, env.uploadPath);
  Container.setValue(logDirToken, env.logDir);
  Container.setValue(superAdminLinkbluesToken, env.superAdminLinkblues);
  Container.setValue(isDevelopmentToken, env.isDevelopmentToken);
}

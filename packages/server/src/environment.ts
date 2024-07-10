import { statSync } from "fs";
import path, { isAbsolute } from "path";

import dotenv from "dotenv";
import { Expo } from "expo-server-sdk";
import { Container, Token } from "typedi";

import type { SyslogLevels } from "#logging/standardLogging.js";

dotenv.config();

// Core env
export const isDevelopment = process.env.NODE_ENV === "development";

export const loggingLevel: SyslogLevels =
  (process.env.LOGGING_LEVEL as SyslogLevels | undefined) ??
  (isDevelopment ? "debug" : "notice");

// Port, Host, and Protocol
let applicationPort: number = 8000;
if (process.env.APPLICATION_PORT) {
  const envApplicationPort = Number.parseInt(process.env.APPLICATION_PORT, 10);
  if (Number.isNaN(envApplicationPort)) {
    throw new TypeError("Env variable 'APPLICATION_PORT' is not a number");
  }
  if (envApplicationPort < 0 || envApplicationPort > 65_535) {
    throw new RangeError(
      "Env variable 'APPLICATION_PORT' is not a valid port number"
    );
  }
  applicationPort = envApplicationPort;
}
export { applicationPort };
export const applicationHost = process.env.APPLICATION_HOST || "localhost";

// Secrets
const { COOKIE_SECRET, JWT_SECRET } = process.env;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set");
}
if (!COOKIE_SECRET) {
  throw new Error("COOKIE_SECRET is not set");
}
export const cookieSecret = COOKIE_SECRET;
export const jwtSecret = JWT_SECRET;

// MS Auth
const { MS_OIDC_URL, MS_CLIENT_ID, MS_CLIENT_SECRET } = process.env;
if (!MS_OIDC_URL) {
  throw new Error("MS_OIDC_URL is not set");
}
if (!MS_CLIENT_ID) {
  throw new Error("MS_CLIENT_ID is not set");
}
if (!MS_CLIENT_SECRET) {
  throw new Error("MS_CLIENT_SECRET is not set");
}
export const msOidcUrl = MS_OIDC_URL;
export const msClientId = MS_CLIENT_ID;
export const msClientSecret = MS_CLIENT_SECRET;

// Expo access token
const { EXPO_ACCESS_TOKEN } = process.env;
if (!EXPO_ACCESS_TOKEN) {
  throw new Error("EXPO_ACCESS_TOKEN is not set");
}
export const expoAccessToken = EXPO_ACCESS_TOKEN;

Container.set(Expo, new Expo({ accessToken: expoAccessToken }));

// DBFunds
const { DBFUNDS_API_KEY, DBFUNDS_API_ORIGIN } = process.env;
if (!DBFUNDS_API_KEY) {
  throw new Error("DBFUNDS_API_KEY is not set");
}
if (!DBFUNDS_API_ORIGIN) {
  throw new Error("DBFUNDS_API_ORIGIN is not set");
}
export const dbFundsApiKeyToken = new Token<string>("DBFUNDS_API_KEY");
export const dbFundsApiOriginToken = new Token<string>("DBFUNDS_API_ORIGIN");

Container.set(dbFundsApiKeyToken, DBFUNDS_API_KEY);
Container.set(dbFundsApiOriginToken, DBFUNDS_API_ORIGIN);

// File upload settings
const { MAX_FILE_SIZE, SERVE_PATH, UPLOAD_PATH, SERVE_ORIGIN } = process.env;
if (!MAX_FILE_SIZE) {
  throw new Error("MAX_FILE_SIZE is not set");
}
if (!SERVE_PATH) {
  throw new Error("SERVE_PATH is not set");
}
if (!UPLOAD_PATH) {
  throw new Error("UPLOAD_PATH is not set");
}
if (!SERVE_ORIGIN) {
  throw new Error("SERVE_ORIGIN is not set");
}
try {
  new URL(SERVE_ORIGIN);
} catch {
  throw new Error("SERVE_ORIGIN is not a valid URL");
}

const maxFileSize = Number.parseInt(MAX_FILE_SIZE, 10);
if (Number.isNaN(maxFileSize)) {
  throw new TypeError("MAX_FILE_SIZE is not a number");
}
if (maxFileSize < 10) {
  throw new RangeError("MAX_FILE_SIZE must be at least 10 (MB)");
}
export { maxFileSize };

if (!isAbsolute(SERVE_PATH) || !isAbsolute(UPLOAD_PATH)) {
  throw new Error("SERVE_PATH and UPLOAD_PATH must be absolute paths");
}
if (statSync(SERVE_PATH).isFile() || statSync(UPLOAD_PATH).isFile()) {
  throw new Error("SERVE_PATH and UPLOAD_PATH must be directories");
}
let uploadParentPath = UPLOAD_PATH;
let isUploadInServe = false;
while (path.dirname(uploadParentPath) !== uploadParentPath) {
  if (uploadParentPath === SERVE_PATH) {
    isUploadInServe = true;
    break;
  }
  uploadParentPath = path.dirname(uploadParentPath);
}
if (!isUploadInServe) {
  throw new Error("UPLOAD_PATH must be a subdirectory of SERVE_PATH");
}

export const serveOrigin = SERVE_ORIGIN;
export const servePath = SERVE_PATH;
export const uploadPath = UPLOAD_PATH;

// Disable all authorization checks
const { OVERRIDE_AUTH } = process.env;
export const authorizationOverride = OVERRIDE_AUTH === "THIS IS DANGEROUS";

// Log directory
const { LOG_DIR } = process.env;
if (!LOG_DIR) {
  throw new Error("LOG_DIR is not set");
}
export const logDir = LOG_DIR;

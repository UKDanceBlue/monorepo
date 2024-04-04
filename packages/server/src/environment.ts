import { statSync } from "fs";
import path, { isAbsolute } from "path";

import dotenv from "dotenv";
import { Expo } from "expo-server-sdk";
import { Container } from "typedi";

import type { SyslogLevels } from "./lib/logging/standardLogging.js";

dotenv.config();

// Core env
export const isDevelopment = process.env.NODE_ENV === "development";
export const isProduction = process.env.NODE_ENV === "production";
export const nodeEnvironment = process.env.NODE_ENV || "development";

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
export const applicationProtocol = process.env.APPLICATION_PROTOCOL || "http";

const applicationUrl = new URL(`${applicationProtocol}://${applicationHost}`);
applicationUrl.protocol = applicationProtocol;
applicationUrl.hostname = applicationHost;
applicationUrl.port = applicationPort.toString();
export { applicationUrl };

// Secrets
const { COOKIE_SECRET, JWT_SECRET, ASSET_PATH } = process.env;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set");
}
if (!COOKIE_SECRET) {
  throw new Error("COOKIE_SECRET is not set");
}
export const cookieSecret = COOKIE_SECRET;
export const jwtSecret = JWT_SECRET;

// System Paths
export const assetPath = ASSET_PATH;

// Database
const { DB_HOST, DB_PORT, DB_UNAME, DB_PWD, DB_NAME } = process.env;
if (!DB_HOST) {
  throw new Error("DB_HOST is not set");
}
if (!DB_PORT) {
  throw new Error("DB_PORT is not set");
}
if (!DB_UNAME) {
  throw new Error("DB_UNAME is not set");
}
if (!DB_PWD) {
  throw new Error("DB_PWD is not set");
}
if (!DB_NAME) {
  throw new Error("DB_NAME is not set");
}
export const databaseHost = DB_HOST;
export const databasePort = DB_PORT;
export const databaseUsername = DB_UNAME;
export const databasePassword = DB_PWD;
export const databaseName = DB_NAME;

// This check is used to try and prevent any chance of resetting the production database
// Obviously not foolproof, but it's better than nothing
export const isDatabaseLocal = databaseHost === "localhost" && isDevelopment;

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

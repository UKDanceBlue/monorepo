import dotenv from "dotenv";

dotenv.config();

const {
  DB_HOST,
  DB_PORT,
  DB_UNAME,
  DB_PWD,
  DB_NAME,
  APPLICATION_HOST,
  NODE_ENV,
  APPLICATION_PORT,
  MS_OIDC_URL,
  MS_CLIENT_ID,
  MS_CLIENT_SECRET,
  OVERRIDE_AUTH,
  COOKIE_SECRET,
  JWT_SECRET,
  ASSET_PATH,
  LOG_LEVEL,
} = process.env;

// Core env
export const isDevelopment = NODE_ENV === "development";
export const isProduction = NODE_ENV === "production";
export const nodeEnvirnoment = NODE_ENV || "development";

// Logging
const allowedLogLevels = [
  "emerg",
  "alert",
  "crit",
  "error",
  "warning",
  "notice",
  "info",
  "debug",
  "trace",
] as const;
export type LogLevel = (typeof allowedLogLevels)[number];

export const logLevel: LogLevel =
  (LOG_LEVEL as LogLevel | undefined) ?? (isDevelopment ? "debug" : "info");
if (!allowedLogLevels.includes(logLevel)) {
  throw new Error(
    `LOG_LEVEL is set to an invalid value: ${logLevel}. Allowed values are: ${allowedLogLevels.join(
      ", "
    )}`
  );
}

// Port and Host
let applicationPort: number = 8000;
if (APPLICATION_PORT) {
  const envApplicationPort = Number.parseInt(APPLICATION_PORT, 10);
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
export const applicationHost = APPLICATION_HOST || "localhost";

// Secrets
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

// Disable all authorization checks
export const authorizationOverride = OVERRIDE_AUTH === "THIS IS DANGEROUS";

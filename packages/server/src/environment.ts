// This file is first imported by index.ts

import { Container } from "@freshgum/typedi";
import dotenv from "dotenv";
import { Expo } from "expo-server-sdk";
import { statSync } from "fs";
import { readFile } from "fs/promises";
import path, { isAbsolute } from "path";

import { setEnvironment } from "#lib/environmentTokens.js";
import { isDevelopment } from "#lib/nodeEnv.js";
import { type SyslogLevels } from "#logging/SyslogLevels.js";
// NOTE: You cannot import any files that depend on environment variables from this file
import { expoServiceToken } from "#notification/expoServiceToken.js";

dotenv.config({ override: true });

if (process.env.NODE_ENV === "test") {
  throw new Error(
    "Environment variables are not set in test environment, instead add mock values to the container"
  );
}

// Load environment variables
const LOGGING_LEVEL = getEnv(
  "LOGGING_LEVEL",
  isDevelopment ? "debug" : "notice"
);
const APPLICATION_PORT = getEnv("APPLICATION_PORT", "8000");
const COOKIE_SECRET = getEnv("COOKIE_SECRET", null);
const JWT_SECRET = getEnv("JWT_SECRET", null);
const MS_OIDC_URL = getEnv("MS_OIDC_URL", null);
const MS_CLIENT_ID = getEnv("MS_CLIENT_ID", null);
const MS_CLIENT_SECRET = getEnv("MS_CLIENT_SECRET", null);
const EXPO_ACCESS_TOKEN = getEnv("EXPO_ACCESS_TOKEN", null);
const DBFUNDS_API_KEY = getEnv("DBFUNDS_API_KEY", null);
const DBFUNDS_API_ORIGIN = getEnv("DBFUNDS_API_ORIGIN", null);
const SERVE_ORIGIN = getEnv("SERVE_ORIGIN", "http://localhost:8000");
const MAX_FILE_SIZE = getEnv("MAX_FILE_SIZE", "10");
const SERVE_PATH = getEnv("SERVE_PATH", "/data/serve");
const UPLOAD_PATH = getEnv("UPLOAD_PATH", "/data/serve/uploads");
const LOG_DIR = getEnv("LOG_DIR", null);
const SUPER_ADMIN_LINKBLUE = getEnv("SUPER_ADMIN_LINKBLUE", Symbol());

// Validation

// Port, Host, and Protocol
const applicationPort = Number.parseInt(await APPLICATION_PORT, 10);
if (Number.isNaN(applicationPort)) {
  throw new TypeError("APPLICATION_PORT is not a number");
}
if (applicationPort < 0 || applicationPort > 65_535) {
  throw new RangeError("APPLICATION_PORT is not a valid port number");
}

// Serve origin
const serveOrigin = await SERVE_ORIGIN;
try {
  new URL(serveOrigin);
} catch {
  throw new Error("SERVE_ORIGIN is not a valid URL");
}

// File upload settings
const servePath = await SERVE_PATH;
const uploadPath = await UPLOAD_PATH;
if (!isAbsolute(servePath) || !isAbsolute(uploadPath)) {
  throw new Error("SERVE_PATH and UPLOAD_PATH must be absolute paths");
}
if (statSync(servePath).isFile() || statSync(uploadPath).isFile()) {
  throw new Error("SERVE_PATH and UPLOAD_PATH must be directories");
}
let uploadParentPath = uploadPath;
let isUploadInServe = false;
while (path.dirname(uploadParentPath) !== uploadParentPath) {
  if (uploadParentPath === servePath) {
    isUploadInServe = true;
    break;
  }
  uploadParentPath = path.dirname(uploadParentPath);
}
if (!isUploadInServe) {
  throw new Error("UPLOAD_PATH must be a subdirectory of SERVE_PATH");
}

const maxFileSize = Number.parseInt(await MAX_FILE_SIZE, 10);
if (Number.isNaN(maxFileSize)) {
  throw new TypeError("MAX_FILE_SIZE is not a number");
}
if (maxFileSize < 10) {
  throw new RangeError("MAX_FILE_SIZE must be at least 10 (MB)");
}

// Super admin
const superAdminLinkblues = await SUPER_ADMIN_LINKBLUE.then((value) => {
  if (typeof value === "string") {
    return value.toLowerCase().split(",");
  }
  return value;
});

// Save values to the container

Container.setValue(
  expoServiceToken,
  new Expo({ accessToken: await EXPO_ACCESS_TOKEN })
);
setEnvironment({
  loggingLevel: (await LOGGING_LEVEL) as SyslogLevels,
  applicationPort,
  cookieSecret: await COOKIE_SECRET,
  jwtSecret: await JWT_SECRET,
  msOidcUrl: await MS_OIDC_URL,
  msClientId: await MS_CLIENT_ID,
  msClientSecret: await MS_CLIENT_SECRET,
  dbFundsApiKey: await DBFUNDS_API_KEY,
  dbFundsApiOrigin: await DBFUNDS_API_ORIGIN,
  serveOrigin,
  maxFileSize,
  servePath,
  uploadPath,
  logDir: await LOG_DIR,
  superAdminLinkblues,
});

/**
 * Get an environment variable
 *
 * If the variable is set in the .env file or system environment, that value will be used.
 * However, if the variable is not set, the function will look for an environment variable
 * with the same name but with "_FILE" appended to the end. If that variable is set, the
 * function will read the file at that path and use its contents as the value.
 * Finally, if the variable is not set, the function will look for a file in /run/secrets
 * with a lowercase name of the variable. If that file exists, the function will read the
 * file at that path and use its contents as the value.
 *
 * If def is undefined, the function will return undefined when the environment variable is not set
 * If def is null, the function will throw an error when the environment variable is not set
 * If def is a string or symbol, the function will return it when the environment variable is not set
 *
 * @param name The key of the environment variable
 * @param def The default value to return if the environment variable is not set
 */
async function getEnv(
  name: string,
  def?: undefined
): Promise<string | undefined>;
async function getEnv(name: string, def: string | null): Promise<string>;
async function getEnv(name: string, def: symbol): Promise<string | symbol>;
async function getEnv(
  name: string,
  def?: string | symbol | null
): Promise<string | symbol | undefined> {
  let value;
  if (process.env[name]) {
    value = process.env[name];
  } else if (process.env[`${name}_FILE`]) {
    try {
      value = await readFile(process.env[`${name}_FILE`]!, "utf8");
    } catch {
      value = process.env[name];
    }
  } else {
    const lowercaseName = name.toLowerCase();
    try {
      value = await readFile(`/run/secrets/${lowercaseName}`, "utf8");
    } catch {
      value = process.env[name];
    }
  }

  if (!value) {
    if (def === null) {
      throw new Error(`Env variable '${name}' is not set`);
    }
    if (def !== undefined) {
      return def;
    }
  }

  return value?.trim();
}

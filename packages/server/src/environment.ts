import dotenv from "dotenv";
import { Expo } from "expo-server-sdk";
import { Container, Token } from "typedi";

import { statSync } from "fs";
import { readFile } from "fs/promises";
import path, { isAbsolute } from "path";


import type { SyslogLevels } from "#logging/standardLogging.js";

dotenv.config();

async function getEnv(
  name: string,
  def?: undefined
): Promise<string | undefined>;
async function getEnv(name: string, def: string | null): Promise<string>;
async function getEnv(
  name: string,
  def?: string | null
): Promise<string | undefined> {
  let value;
  if (process.env[`${name}_FILE`]) {
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

export const isDevelopment = process.env.NODE_ENV === "development";

const LOGGING_LEVEL = getEnv(
  "LOGGING_LEVEL",
  isDevelopment ? "debug" : "notice"
);
const APPLICATION_PORT = getEnv("APPLICATION_PORT", "8000");
const APPLICATION_HOST = getEnv("APPLICATION_HOST", "localhost");
const COOKIE_SECRET = getEnv("COOKIE_SECRET", null);
const JWT_SECRET = getEnv("JWT_SECRET", null);
const MS_OIDC_URL = getEnv("MS_OIDC_URL", null);
const MS_CLIENT_ID = getEnv("MS_CLIENT_ID", null);
const MS_CLIENT_SECRET = getEnv("MS_CLIENT_SECRET", null);
const EXPO_ACCESS_TOKEN = getEnv("EXPO_ACCESS_TOKEN", null);
const DBFUNDS_API_KEY = getEnv("DBFUNDS_API_KEY", null);
const DBFUNDS_API_ORIGIN = getEnv("DBFUNDS_API_ORIGIN", null);
const MAX_FILE_SIZE = getEnv("MAX_FILE_SIZE", "10");
const SERVE_PATH = getEnv("SERVE_PATH", null);
const UPLOAD_PATH = getEnv("UPLOAD_PATH", null);
const SERVE_ORIGIN = getEnv("SERVE_ORIGIN", null);
const LOG_DIR = getEnv("LOG_DIR", null);

// Core env
export const loggingLevel: SyslogLevels = (await LOGGING_LEVEL) as SyslogLevels;

// Port, Host, and Protocol
export const applicationPort = Number.parseInt(await APPLICATION_PORT, 10);
if (Number.isNaN(applicationPort)) {
  throw new TypeError("Env variable 'APPLICATION_PORT' is not a number");
}
if (applicationPort < 0 || applicationPort > 65_535) {
  throw new RangeError(
    "Env variable 'APPLICATION_PORT' is not a valid port number"
  );
}

export const applicationHost = await APPLICATION_HOST;

// Secrets
export const cookieSecret = await COOKIE_SECRET;
export const jwtSecret = await JWT_SECRET;

// MS Auth
export const msOidcUrl = await MS_OIDC_URL;
export const msClientId = await MS_CLIENT_ID;
export const msClientSecret = await MS_CLIENT_SECRET;

// Expo access token
export const expoAccessToken = await EXPO_ACCESS_TOKEN;

Container.set(Expo, new Expo({ accessToken: expoAccessToken }));

// DBFunds
export const dbFundsApiKeyToken = new Token<string>("DBFUNDS_API_KEY");
export const dbFundsApiOriginToken = new Token<string>("DBFUNDS_API_ORIGIN");

Container.set(dbFundsApiKeyToken, await DBFUNDS_API_KEY);
Container.set(dbFundsApiOriginToken, await DBFUNDS_API_ORIGIN);

// File upload settings
export const serveOrigin = await SERVE_ORIGIN;
try {
  new URL(serveOrigin);
} catch {
  throw new Error("SERVE_ORIGIN is not a valid URL");
}
export const servePath = await SERVE_PATH;
export const uploadPath = await UPLOAD_PATH;

export const maxFileSize = Number.parseInt(await MAX_FILE_SIZE, 10);
if (Number.isNaN(maxFileSize)) {
  throw new TypeError("MAX_FILE_SIZE is not a number");
}
if (maxFileSize < 10) {
  throw new RangeError("MAX_FILE_SIZE must be at least 10 (MB)");
}

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

// Log directory
export const logDir = await LOG_DIR;

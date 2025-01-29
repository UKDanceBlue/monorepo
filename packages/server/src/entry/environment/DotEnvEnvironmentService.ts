import { Service } from "@freshgum/typedi";
import dotenv from "dotenv";
import { statSync } from "fs";
import { readFile } from "fs/promises";
import { dirname } from "path";
import { isAbsolute } from "path/posix";

import type { SyslogLevels } from "#lib/logging/SyslogLevels.js";
import type { Environment } from "#lib/typediTokens.js";

import { EnvironmentService } from "./environment.js";

@Service({ scope: "singleton" }, [])
export abstract class DotEnvEnvironmentService extends EnvironmentService {
  protected async getEnvObject(): Promise<Environment & { NODE_ENV: string }> {
    const rawEnvironment: Record<string, string | undefined> = structuredClone(
      process.env
    );

    dotenv.config({
      override: true,
      processEnv: rawEnvironment as Record<string, string>,
    });

    const NODE_ENV = await this.getEnv(
      rawEnvironment,
      "NODE_ENV",
      "production"
    );

    if (NODE_ENV === "test") {
      throw new Error(
        "DotEnvEnvironmentService should not be used in a test environment, instead add mock values to the container"
      );
    }

    const isDevelopment = NODE_ENV === "development";

    // Load environment variables
    const LOGGING_LEVEL = this.getEnv(
      rawEnvironment,
      "LOGGING_LEVEL",
      isDevelopment ? "debug" : "notice"
    );
    const APPLICATION_PORT = this.getEnv(
      rawEnvironment,
      "APPLICATION_PORT",
      "8000"
    );
    const COOKIE_SECRET = this.getEnv(rawEnvironment, "COOKIE_SECRET", null);
    const JWT_SECRET = this.getEnv(rawEnvironment, "JWT_SECRET", null);
    const INSTAGRAM_API_KEY = this.getEnv(
      rawEnvironment,
      "INSTAGRAM_API_KEY",
      null
    );
    const MS_OIDC_URL = this.getEnv(rawEnvironment, "MS_OIDC_URL", null);
    const MS_CLIENT_ID = this.getEnv(rawEnvironment, "MS_CLIENT_ID", null);
    const MS_CLIENT_SECRET = this.getEnv(
      rawEnvironment,
      "MS_CLIENT_SECRET",
      null
    );
    const EXPO_ACCESS_TOKEN = this.getEnv(
      rawEnvironment,
      "EXPO_ACCESS_TOKEN",
      null
    );
    const DBFUNDS_ENABLED = this.getEnv(
      rawEnvironment,
      "DBFUNDS_ENABLED",
      "false"
    );
    const DBFUNDS_API_KEY = this.getEnv(rawEnvironment, "DBFUNDS_API_KEY");
    const DBFUNDS_API_ORIGIN = this.getEnv(
      rawEnvironment,
      "DBFUNDS_API_ORIGIN"
    );
    const MAX_FILE_SIZE = this.getEnv(rawEnvironment, "MAX_FILE_SIZE", "10");
    const SERVE_PATH = this.getEnv(rawEnvironment, "SERVE_PATH", "/data/serve");
    const UPLOAD_PATH = this.getEnv(
      rawEnvironment,
      "UPLOAD_PATH",
      "/data/serve/uploads"
    );
    const LOG_DIR = this.getEnv(rawEnvironment, "LOG_DIR", null);
    const SUPER_ADMIN_LINKBLUE = this.getEnv(
      rawEnvironment,
      "SUPER_ADMIN_LINKBLUE",
      Symbol()
    );

    // Validation
    // Port, Host, and Protocol
    const applicationPort = Number.parseInt(await APPLICATION_PORT, 10);
    if (Number.isNaN(applicationPort)) {
      throw new TypeError("APPLICATION_PORT is not a number");
    }
    if (applicationPort < 0 || applicationPort > 65_535) {
      throw new RangeError("APPLICATION_PORT is not a valid port number");
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
    while (dirname(uploadParentPath) !== uploadParentPath) {
      if (uploadParentPath === servePath) {
        isUploadInServe = true;
        break;
      }
      uploadParentPath = dirname(uploadParentPath);
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
    return {
      NODE_ENV,
      expoApiKey: await EXPO_ACCESS_TOKEN,
      loggingLevel: (await LOGGING_LEVEL) as SyslogLevels,
      applicationPort,
      cookieSecret: await COOKIE_SECRET,
      jwtSecret: await JWT_SECRET,
      instagramApiKey: await INSTAGRAM_API_KEY,
      msOidcUrl: new URL(await MS_OIDC_URL),
      msClientId: await MS_CLIENT_ID,
      msClientSecret: await MS_CLIENT_SECRET,
      dbFundsEnabled: (await DBFUNDS_ENABLED) === "true",
      dbFundsApiKey: await DBFUNDS_API_KEY,
      dbFundsApiOrigin: await DBFUNDS_API_ORIGIN,
      maxFileSize,
      servePath,
      uploadPath,
      logDir: await LOG_DIR,
      superAdminLinkblues,
      isDevelopmentToken: isDevelopment,
      isRepl: false,
    };
  }

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
  private async getEnv(
    env: Record<string, string | undefined>,
    name: string,
    def?: undefined
  ): Promise<string | undefined>;
  private async getEnv(
    env: Record<string, string | undefined>,
    name: string,
    def: string | null
  ): Promise<string>;
  private async getEnv(
    env: Record<string, string | undefined>,
    name: string,
    def: symbol
  ): Promise<string | symbol>;
  private async getEnv(
    env: Record<string, string | undefined>,
    name: string,
    def?: string | symbol | null
  ): Promise<string | symbol | undefined> {
    let value;
    if (env[name]) {
      value = env[name];
    } else if (env[`${name}_FILE`]) {
      try {
        value = await readFile(env[`${name}_FILE`]!, "utf8");
      } catch {
        value = env[name];
      }
    } else {
      const lowercaseName = name.toLowerCase();
      try {
        value = await readFile(`/run/secrets/${lowercaseName}`, "utf8");
      } catch {
        value = env[name];
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
}

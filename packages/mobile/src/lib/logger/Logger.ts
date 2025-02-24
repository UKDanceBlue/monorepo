import { debugStringify } from "@ukdanceblue/common";
import isError from "lodash/isError";

import { ConsoleTransport } from "./ConsoleTransport";
import { SentryTransport } from "./SentryTransport";
import type { ExtraLogArgs, LoggerTransport } from "./transport";
import { LogLevel } from "./transport";

export class Logger {
  static #instance: Logger = new Logger(
    new ConsoleTransport(__DEV__ ? LogLevel.debug : LogLevel.error + 1),
    new SentryTransport(LogLevel.debug)
  );

  #transports: LoggerTransport[];

  constructor(...transports: LoggerTransport[]) {
    this.#transports = transports;
  }

  log(
    level: LogLevel,
    message: string | boolean | bigint | number | object,
    extra: ExtraLogArgs = {}
  ) {
    for (const transport of this.#transports) {
      try {
        transport.log({
          level,
          message,
          messageString: debugStringify(message),
          extra,
        });
      } catch (error) {
        console.error(
          `Error writing log to ${transport.name}Transport: ${String(error)}`
        );
      }
    }
  }

  static get instance(): Logger {
    return Logger.#instance;
  }

  static debug(
    message: string | boolean | bigint | number | object,
    extra: ExtraLogArgs = {}
  ) {
    Logger.instance.log(LogLevel.debug, message, extra);
  }

  static info(
    message: string | boolean | bigint | number | object,
    extra: ExtraLogArgs = {}
  ) {
    Logger.instance.log(LogLevel.info, message, extra);
  }

  static warn(
    message: string | boolean | bigint | number | object,
    extra: ExtraLogArgs = {}
  ) {
    Logger.instance.log(LogLevel.warn, message, extra);
  }

  static error(
    message: string | boolean | bigint | number | object,
    extra: ExtraLogArgs = {}
  ) {
    Logger.instance.log(LogLevel.error, message, extra);
  }
}

export function universalCatch(error: unknown) {
  try {
    if (isError(error)) {
      Logger.error("Caught error", { error });
    } else if (
      typeof error === "string" ||
      typeof error === "number" ||
      typeof error === "boolean" ||
      (typeof error === "object" && error !== null)
    ) {
      Logger.error(String(error));
    } else {
      console.error(error);
    }
  } catch (error) {
    try {
      console.error(error);
    } catch {
      // ignore, we don't want a looping crash
    }
  }
}

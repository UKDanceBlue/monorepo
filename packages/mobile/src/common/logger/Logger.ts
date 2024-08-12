import { ConsoleTransport } from "./ConsoleTransport";
import { SentryTransport } from "./CrashlyticsTransport";
import { LogLevel } from "./transport";

import type { ExtraLogArgs, LoggerTransport } from "./transport";

export class Logger {
  static #instance: Logger = new Logger(
    new ConsoleTransport(LogLevel.debug),
    new SentryTransport(LogLevel.info)
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
    let messageString = "ERROR: Message could not be stringified";
    switch (typeof message) {
      case "string":
      case "boolean":
      case "bigint":
      case "number":
      case "symbol": {
        messageString = message.toString();
        break;
      }
      case "object": {
        try {
          messageString = JSON.stringify(message, null, 2);
        } catch (error) {
          messageString = `[object: '${String(
            message
          )}' - could not be stringified due to ${String(error)}]`;
        }
        break;
      }
      case "undefined": {
        messageString = "[undefined]";
        break;
      }
      case "function": {
        messageString = `[function: ${message.name}]`;
        break;
      }
    }

    for (const transport of this.#transports) {
      try {
        transport.log({ level, message, messageString, extra });
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

  static log(
    message: string | boolean | bigint | number | object,
    extra: ExtraLogArgs = {}
  ) {
    Logger.instance.log(LogLevel.log, message, extra);
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

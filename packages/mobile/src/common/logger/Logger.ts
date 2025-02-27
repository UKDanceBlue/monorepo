import { debugStringify } from "@ukdanceblue/common";

import { ConsoleTransport } from "./ConsoleTransport";
import { MemoryTransport } from "./MemoryTransport";
import { SentryTransport } from "./SentryTransport";
import type { ExtraLogArgs, LoggerTransport } from "./transport";
import { LogLevel } from "./transport";

export class Logger {
  static #instance: Logger = new Logger(
    new ConsoleTransport(__DEV__ ? LogLevel.debug : LogLevel.error + 1),
    new SentryTransport(LogLevel.debug),
    new MemoryTransport(LogLevel.info)
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

  public get memoryTransport(): MemoryTransport {
    const memory = this.#transports.find(
      (transport) => transport instanceof MemoryTransport
    );
    if (!memory) {
      // Return a no-op transport if none is found
      return new MemoryTransport(LogLevel.info);
    }
    return memory;
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

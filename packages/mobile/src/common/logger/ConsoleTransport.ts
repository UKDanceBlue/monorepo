import type { ExtraLogArgs } from "./transport";
import { LogLevel, LoggerTransport } from "./transport";

export class ConsoleTransport extends LoggerTransport {
  constructor(level: LogLevel) {
    super("Console", level);
  }

  protected writeLog({
    level,
    message,
    extra,
  }: {
    level: LogLevel;
    message: string | boolean | bigint | number | object;
    extra: ExtraLogArgs;
  }) {
    switch (level) {
      case LogLevel.debug: {
        console.debug(message, extra);
        break;
      }
      case LogLevel.log: {
        console.log(message, extra);
        break;
      }
      case LogLevel.info: {
        console.info(message, extra);
        break;
      }
      case LogLevel.warn: {
        console.warn(message, extra);
        break;
      }
      case LogLevel.error: {
        console.error(message, extra);
        break;
      }
    }
  }
}

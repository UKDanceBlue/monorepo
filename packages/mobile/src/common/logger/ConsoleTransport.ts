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
    extra: ExtraLogArgs<true>;
  }) {
    const args = [message];
    if (Object.keys(extra).length > 0) {
      try {
        args.push(JSON.stringify(extra));
      } catch (error) {
        args.push(
          `[extra: '${String(
            extra
          )}' - could not be stringified due to ${String(error)}]`
        );
      }
    }
    switch (level) {
      case LogLevel.debug: {
        console.debug(...args);
        break;
      }
      case LogLevel.log: {
        console.log(...args);
        break;
      }
      case LogLevel.info: {
        console.info(...args);
        break;
      }
      case LogLevel.warn: {
        console.warn(...args);
        break;
      }
      case LogLevel.error: {
        console.error(...args);
        break;
      }
    }
  }
}

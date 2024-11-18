import type { ExtraLogArgs } from "./transport";
import { LoggerTransport, LogLevel } from "./transport";

function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch (error) {
    return String(value);
  }
}

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
    const { context, error, source, tags } = extra;

    try {
      const args = [
        ...(source ? [`${source}:`] : []),
        ...(tags ? [`[${tags.join(",")}]`] : []),
        message,
      ];

      if (context && !error) {
        args.push(safeStringify(context));
      } else if (error && !context) {
        args.push(safeStringify(error));
      } else if (error && context) {
        args.push(safeStringify({ error, context }));
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
    } catch (error) {
      console.error("Error when trying to write a log message", {
        level,
        message,
        extra,
      });
    }
  }
}

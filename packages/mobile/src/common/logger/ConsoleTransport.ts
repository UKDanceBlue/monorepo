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
    let extraString: string | undefined;
    if (Object.keys(extra).length > 0) {
      try {
        extraString = JSON.stringify(extra);
      } catch (error) {
        extraString = `[extra: '${String(
          extra
        )}' - could not be stringified due to ${String(error)}]`;
      }
    }
    switch (level) {
      case LogLevel.debug: {
        console.debug(message, extraString);
        break;
      }
      case LogLevel.log: {
        console.log(message, extraString);
        break;
      }
      case LogLevel.info: {
        console.info(message, extraString);
        break;
      }
      case LogLevel.warn: {
        console.warn(message, extraString);
        break;
      }
      case LogLevel.error: {
        console.error(message, extraString);
        break;
      }
    }
  }
}

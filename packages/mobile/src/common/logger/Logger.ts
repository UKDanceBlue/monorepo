import { ConsoleTransport } from "./ConsoleTransport";
import type { ExtraLogArgs, LogLevel, LoggerTransport } from "./transport";

export class Logger {
  static instance: Logger = new Logger([ConsoleTransport]);

  #transports: LoggerTransport[];

  constructor(transports: LoggerTransport[]) {
    this.#transports = transports;
  }

  log(
    level: LogLevel,
    message: string | boolean | bigint | number | object,
    extra: ExtraLogArgs = {}
  ) {
    let messageString: string = "ERROR: Message could not be stringified";
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
      transport.log({ level, message, messageString, extra });
    }
  }
}

import { LogLevel, type LoggerTransport } from "./transport";

export const ConsoleTransport: LoggerTransport = {
  log({ level, message, extra }) {
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
  },
};

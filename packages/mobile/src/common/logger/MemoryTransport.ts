import { debugStringify } from "@ukdanceblue/common";

import type { ExtraLogArgs, LogLevel } from "./transport";
import { LoggerTransport } from "./transport";

export class MemoryTransport extends LoggerTransport {
  constructor(level: number) {
    super("Console", level);
  }

  private readonly BUFFER_SIZE = 1000;
  private buffer: [LogLevel, string][] = [];
  private listeners = new Set<() => void>();

  private writeLine(level: LogLevel, line: string) {
    this.buffer.push([level, line]);
    if (this.buffer.length > this.BUFFER_SIZE) {
      this.buffer.shift();
    }
    this.listeners.forEach((listener) => listener());
  }
  public getBuffer(): [LogLevel, string][] {
    return [...this.buffer];
  }
  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
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
        args.push(debugStringify(context));
      } else if (error && !context) {
        args.push(debugStringify(error));
      } else if (error && context) {
        args.push(debugStringify({ error, context }));
      }

      this.writeLine(level, args.join(" "));
    } catch (error) {
      console.error("Error when trying to write a log message", {
        level,
        message,
        extra,
      });
    }
  }
}

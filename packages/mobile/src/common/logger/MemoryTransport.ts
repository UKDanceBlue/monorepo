import { debugStringify } from "@ukdanceblue/common";

import type { ExtraLogArgs } from "./transport";
import { LoggerTransport, LogLevel } from "./transport";

export class MemoryTransport extends LoggerTransport {
  constructor(level: number) {
    super("Console", level);
  }

  private readonly BUFFER_SIZE = 1000;
  private buffer: string[] = [];
  private listeners = new Set<(buffer: readonly string[]) => void>();

  private writeLine(line: string) {
    this.buffer.push(line);
    if (this.buffer.length > this.BUFFER_SIZE) {
      this.buffer.shift();
    }
  }
  public getBuffer(): readonly string[] {
    return this.buffer;
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

      switch (level) {
        case LogLevel.debug: {
          this.writeLine(`DEBUG: ${args.join(" ")}`);
          break;
        }
        case LogLevel.info: {
          this.writeLine(`INFO: ${args.join(" ")}`);
          break;
        }
        case LogLevel.warn: {
          this.writeLine(`WARN: ${args.join(" ")}`);
          break;
        }
        case LogLevel.error: {
          this.writeLine(`ERROR: ${args.join(" ")}`);
          break;
        }
        default: {
          level satisfies never;
          throw new Error(`Unknown log level: ${String(level)}`);
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

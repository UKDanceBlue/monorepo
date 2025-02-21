export const LogLevel = {
  debug: 0,
  log: 1,
  info: 2,
  warn: 3,
  error: 4,
} as const;
export type LogLevel = (typeof LogLevel)[keyof typeof LogLevel];

export const logLevelToString = (
  level: LogLevel
): "debug" | "log" | "info" | "error" | "warning" => {
  switch (level) {
    case LogLevel.debug: {
      return "debug";
    }
    case LogLevel.log: {
      return "log";
    }
    case LogLevel.info: {
      return "info";
    }
    case LogLevel.warn: {
      return "warning";
    }
    case LogLevel.error: {
      return "error";
    }
    default: {
      return "error";
    }
  }
};

export type LoggerTags = "graphql" | "navigation" | "global" | "critical";

export interface ExtraLogArgs<Strict extends boolean = boolean> {
  error?: Strict extends true ? Error : unknown;
  context?: object;
  tags?: LoggerTags[];
  source?: string;
}

export abstract class LoggerTransport {
  #level: number;
  #name: string;

  constructor(name: string, level: number) {
    this.#level = level;
    this.#name = name;
  }

  public get name(): string {
    return this.#name;
  }

  protected abstract writeLog(param: {
    level: LogLevel;
    message: string | boolean | bigint | number | object;
    messageString: string;
    extra: ExtraLogArgs<true>;
  }): void;

  public log({
    level,
    message,
    messageString,
    extra,
  }: {
    level: LogLevel;
    message: string | boolean | bigint | number | object;
    messageString: string;
    extra: ExtraLogArgs;
  }) {
    if (level >= this.#level) {
      this.writeLog({
        level,
        message,
        messageString,
        extra:
          extra.error != null
            ? {
                ...extra,
                error:
                  extra.error instanceof Error
                    ? extra.error
                    : typeof extra.error === "string"
                      ? new Error(extra.error)
                      : // @ts-expect-error Allowing error.cause
                        new Error("Nonstandard error", { cause: extra.error }),
              }
            : (extra as Omit<typeof extra, "error">),
      });
    }
  }
}

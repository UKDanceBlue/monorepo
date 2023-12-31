export const LogLevel = {
  debug: 0,
  log: 1,
  info: 2,
  warn: 3,
  error: 4,
} as const;
export type LogLevel = (typeof LogLevel)[keyof typeof LogLevel];

export const logLevelToString = (level: LogLevel) => {
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
      return "warn";
    }
    case LogLevel.error: {
      return "error";
    }
    default: {
      return "unknown";
    }
  }
};

export interface ExtraLogArgs {
  error?: Error;
  context?: object;
  tags?: string[];
}

export abstract class LoggerTransport {
  #level: LogLevel;
  #name: string;

  constructor(name: string, level: LogLevel) {
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
    extra: ExtraLogArgs;
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
      this.writeLog({ level, message, messageString, extra });
    }
  }
}

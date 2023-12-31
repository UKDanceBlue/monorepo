export const LogLevel = {
  debug: 0,
  log: 1,
  info: 2,
  warn: 3,
  error: 4,
} as const;
export type LogLevel = (typeof LogLevel)[keyof typeof LogLevel];

export interface ExtraLogArgs {
  error?: Error;
  context?: object;
  tags?: string[];
}

export interface LoggerTransport {
  log(param: {
    level: LogLevel;
    message: string | boolean | bigint | number | object;
    messageString: string;
    extra: ExtraLogArgs;
  }): void;
}

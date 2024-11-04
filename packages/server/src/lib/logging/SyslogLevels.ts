import type winston from "winston";

export const SyslogLevels = {
  emerg: 0,
  alert: 1,
  crit: 2,
  error: 3,
  warning: 4,
  notice: 5,
  info: 6,
  debug: 7,
  trace: 8,
} as const satisfies winston.config.AbstractConfigSetLevels;
export type SyslogLevels = keyof typeof SyslogLevels;

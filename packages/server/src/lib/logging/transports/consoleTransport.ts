import { format, transports } from "winston";

import { syslogColors } from "../base.js";

export const consoleTransport = new transports.Console({
  format: format.combine(
    format.splat(),
    format.simple(),
    format.colorize({
      colors: syslogColors,
    })
  ),
});

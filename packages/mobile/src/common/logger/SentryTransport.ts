import * as Sentry from "@sentry/react-native";
import { debugStringify } from "@ukdanceblue/common";

import type { ExtraLogArgs, LogLevel } from "./transport";
import { LoggerTransport, logLevelToString } from "./transport";

export class SentryTransport extends LoggerTransport {
  constructor(level: number) {
    super("Sentry", level);
  }

  protected writeLog({
    level,
    messageString,
    extra,
  }: {
    level: LogLevel;
    messageString: string;
    extra: ExtraLogArgs<true>;
  }) {
    if (extra.error) {
      Sentry.captureException(extra.error, {
        tags: {
          ...Object.fromEntries(extra.tags?.map((tag) => [tag, true]) ?? []),
          source: extra.source,
          logLevel: logLevelToString(level),
        },
        extra: {
          message: debugStringify(messageString),
          ...extra.context,
        },
      });
    } else {
      Sentry.captureMessage(debugStringify(messageString), {
        tags: {
          ...Object.fromEntries(extra.tags?.map((tag) => [tag, true]) ?? []),
          source: extra.source,
          logLevel: logLevelToString(level),
        },
        extra: extra.context && {
          ...extra.context,
        },
      });
    }
  }
}

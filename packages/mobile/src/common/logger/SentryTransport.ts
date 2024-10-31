import { captureException, captureMessage } from "@sentry/react-native";

import type { ExtraLogArgs, LogLevel } from "./transport";
import { LoggerTransport, logLevelToString } from "./transport";

export class SentryTransport extends LoggerTransport {
  constructor(level: LogLevel) {
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
    const levelString = logLevelToString(level);
    let contextString: string | undefined = undefined;
    if (extra.context) {
      try {
        contextString = JSON.stringify(extra.context, null, 2);
      } catch {
        contextString = String(extra.context);
      }
    }
    const tagsObject: Record<string, boolean> = {};
    for (const tag of extra.tags ?? []) {
      tagsObject[tag] = true;
    }

    if (!extra.error) {
      captureMessage(messageString, {
        level: levelString,
        tags: {
          ...tagsObject,
          source: extra.source,
        },
        extra: {
          context: contextString,
        },
      });
    } else {
      captureException(extra.error, {
        level: levelString,
        tags: {
          ...tagsObject,
          source: extra.source,
        },
        extra: {
          message: messageString,
          context: contextString,
        },
      });
    }
  }
}

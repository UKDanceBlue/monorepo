import * as Sentry from "@sentry/react-native";
import { debugStringify } from "@ukdanceblue/common";
import { CombinedError } from "urql";

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
      let { error } = extra;
      const { tags, source, context } = extra;
      let status: number | undefined = undefined;

      if (error instanceof CombinedError) {
        const { graphQLErrors, networkError, response } = error;
        if (networkError) {
          error = networkError;
        } else if (graphQLErrors.length === 1) {
          error = graphQLErrors[0];
        }
        ({ status } = response as Response);
      }

      Sentry.captureException(error, {
        tags: {
          ...Object.fromEntries(tags?.map((tag) => [tag, true]) ?? []),
          ...(source ? { source } : {}),
          ...(status !== undefined ? { status } : {}),
        },
        extra: {
          message: debugStringify(messageString),
          ...context,
        },
        level: logLevelToString(level),
      });
    } else {
      Sentry.addBreadcrumb(
        {
          message: debugStringify(messageString),
          category: "log",
          level: logLevelToString(level),
        },
        {
          tags: {
            ...Object.fromEntries(extra.tags?.map((tag) => [tag, true]) ?? []),
            source: extra.source,
          },
          extra: extra.context && {
            ...extra.context,
          },
        }
      );
    }
  }
}

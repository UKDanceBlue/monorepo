import type { FirebaseCrashlyticsTypes } from "@react-native-firebase/crashlytics";

import type { ExtraLogArgs, LogLevel } from "./transport";
import { LoggerTransport, logLevelToString } from "./transport";

export class CrashlyticsTransport extends LoggerTransport {
  #crashlytics: FirebaseCrashlyticsTypes.Module;

  constructor(level: LogLevel, crashlytics: FirebaseCrashlyticsTypes.Module) {
    super("Crashlytics", level);
    this.#crashlytics = crashlytics;
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
    let logString = `[${logLevelToString(level)}]`;
    if (extra.source) {
      logString += ` - ${extra.source}] -`;
    }
    if (extra.tags) {
      logString += ` [${extra.tags.join(", ")}]`;
    }
    logString += ` ${messageString}`;
    if (extra.context) {
      try {
        logString += `\n${JSON.stringify(extra.context, null, 2)}`;
      } catch (error) {
        logString += ` [context (${String(
          extra.context
        )}) could not be stringified due to ${String(error)}]`;
      }
    }
    if (extra.error) {
      logString += `\nerror: (${String(extra.error)})`;
    }
    this.#crashlytics.log(logString);

    if (extra.error) {
      this.#crashlytics.recordError(extra.error);
    }
  }
}

import type { DateTime, Duration, Interval } from "luxon";
import type { Result } from "ts-results-es";
import { Err, Ok } from "ts-results-es";

import { ConcreteError } from "./error.js";
import { LuxonError as ErrorCodeLuxonError } from "./errorCode.js";

export class LuxonError extends ConcreteError {
  constructor(
    protected readonly value:
      | DateTime<false>
      | Interval<false>
      | Duration<false>
  ) {
    super();
  }

  get message() {
    return this.value.invalidReason;
  }

  get detailedMessage() {
    return this.value.invalidExplanation ?? this.message;
  }

  get tag(): ErrorCodeLuxonError {
    return ErrorCodeLuxonError;
  }

  readonly expose = true;

  static luxonObjectToResult(
    interval: Interval
  ): Result<Interval<true>, LuxonError>;
  static luxonObjectToResult(
    duration: Duration
  ): Result<Duration<true>, LuxonError>;
  static luxonObjectToResult(
    date: DateTime
  ): Result<DateTime<true>, LuxonError>;
  static luxonObjectToResult(
    val: DateTime | Interval | Duration
  ): Result<DateTime<true> | Interval<true> | Duration<true>, LuxonError> {
    return val.isValid ? Ok(val) : Err(new LuxonError(val));
  }
}
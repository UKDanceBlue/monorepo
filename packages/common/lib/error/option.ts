import type { Result } from "ts-results-es";
import { Option } from "ts-results-es";
import { Err, None, Ok, Some } from "ts-results-es";

import type { NotFoundError } from "./direct.js";
import type { ExtendedError } from "./error.js";
import { NotFound as ErrorCodeNotFound } from "./errorCode.js";

export function optionOf<T>(
  value: T | null | undefined | Option<T>
): Option<T> {
  if (Option.isOption(value)) {
    return value;
  }
  return value == null ? None : Some(value);
}

export function extractNotFound<T, E extends ExtendedError>(
  result: Result<
    T | null | undefined,
    Exclude<E, NotFoundError> | NotFoundError
  >
): Result<Option<T>, E> {
  return result.isErr()
    ? result.orElse((error) =>
        error.tag === ErrorCodeNotFound ? Ok(None) : Err(error)
      )
    : result.map((value) => optionOf(value));
}

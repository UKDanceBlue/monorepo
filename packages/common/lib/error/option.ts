import type { Result } from "ts-results-es";
import { Option } from "ts-results-es";
import { None, Ok, Some } from "ts-results-es";

import type { NotFoundError } from "./direct.js";
import { NotFound as ErrorCodeNotFound } from "./errorCode.js";
import type { ExtendedError } from "./index.js";

export function optionOf<T>(
  value: T | null | undefined | Option<T>
): Option<T> {
  if (Option.isOption(value)) {
    return value;
  }
  return value == null ? None : Some(value);
}

export function extractNotFound<
  T,
  E extends Exclude<ExtendedError, NotFoundError>,
>(
  result: Result<T | null | undefined, E | NotFoundError>
): Result<Option<T>, E> {
  return result.isErr() && result.error.tag === ErrorCodeNotFound
    ? Ok(None)
    : (result.map((value) => optionOf(value)) as Result<Option<T>, E>);
}

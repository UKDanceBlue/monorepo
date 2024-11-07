import type { Option, Result } from "ts-results-es";
import { Err, None, Ok, Some } from "ts-results-es";

import type { NotFoundError } from "./direct.js";
import type { ConcreteError } from "./error.js";
import { ErrorCode } from "./index.js";

export function optionOf<T>(value: T | null | undefined): Option<T> {
  return value == null ? None : Some(value);
}

export function extractNotFound<T, E extends ConcreteError>(
  result: Result<
    T | null | undefined,
    Exclude<E, NotFoundError> | NotFoundError
  >
): Result<Option<T>, E> {
  return result.isErr()
    ? result.orElse((error) =>
        error.tag === ErrorCode.NotFound ? Ok(None) : Err(error)
      )
    : result.map((value) => optionOf(value));
}

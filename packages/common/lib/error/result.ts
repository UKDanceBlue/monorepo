import type { Result } from "ts-results-es";

import type { ExtendedError, JsError, UnknownError } from "./error.js";

export type ConcreteResult<T, E extends ExtendedError = ExtendedError> = Result<
  T,
  E
>;

export type JsResult<T, E extends ExtendedError> = ConcreteResult<
  T,
  E | JsError | UnknownError
>;

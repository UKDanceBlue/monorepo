import type { ConcreteError, JsError, UnknownError } from "./error.js";
import type { Result } from "ts-results-es";

export type ConcreteResult<T, E extends ConcreteError = ConcreteError> = Result<
  T,
  E
>;

export type JsResult<T, E extends ConcreteError> = ConcreteResult<
  T,
  E | JsError | UnknownError
>;

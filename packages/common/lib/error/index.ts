export * from "./composite.js";
export * from "./control.js";
export * from "./direct.js";
export * from "./error.js";
export * as ErrorCode from "./errorCode.js";
export * from "./fetch.js";
export * from "./http.js";
export * from "./luxon.js";
export * from "./option.js";
export type * from "./result.js";

import type * as ErrorCode from "./errorCode.js";
export type ErrorCodeType = (typeof ErrorCode)[keyof typeof ErrorCode];

import type { CompositeError } from "./composite.js";
import type {
  InvalidArgumentError,
  InvalidOperationError,
  InvalidStateError,
  InvariantError,
  NotFoundError,
  TimeoutError,
} from "./direct.js";
import type { JsError, UnknownError } from "./error.js";
import type { FetchError } from "./fetch.js";
import type { HttpError } from "./http.js";
import type { LuxonError } from "./luxon.js";
export type ErrorType =
  | JsError
  | UnknownError
  | InvalidArgumentError
  | InvalidOperationError
  | InvalidStateError
  | InvariantError
  | NotFoundError
  | TimeoutError
  | HttpError
  | FetchError
  | CompositeError<ErrorType>
  | LuxonError;

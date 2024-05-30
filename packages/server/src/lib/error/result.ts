import { Result } from "true-myth";

import type { ConcreteError } from "./error.js";
import { JsError, UnknownError } from "./error.js";
import type { HttpError } from "./http.js";
import type { PrismaError } from "./prisma.js";
import type { ZodError } from "./zod.js";

export type ConcreteErrorTypes =
  | UnknownError
  | JsError
  | HttpError
  | PrismaError
  | ZodError;

export type ConcreteResult<T, E extends ConcreteError> = Result<T, E>;

export type JsResult<T, E extends ConcreteError> = ConcreteResult<
  T,
  E | JsError | UnknownError
>;

export function resultFromJsError(error: unknown): JsResult<never, never> {
  return Result.err(
    error instanceof Error ? new JsError(error) : new UnknownError(error)
  );
}

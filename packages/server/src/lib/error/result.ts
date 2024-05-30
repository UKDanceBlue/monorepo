import type { Result } from "true-myth";

import type { ConcreteError, JsError, UnknownError } from "./error.js";
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

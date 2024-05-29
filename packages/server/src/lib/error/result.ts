import type { Result } from "true-myth";

import type { JsError, UnknownError } from "./error.js";
import type { HttpError } from "./http.js";
import type { PrismaError } from "./prisma.js";
import type { ZodError } from "./zod.js";

export type ConcreteErrorTypes =
  | UnknownError
  | JsError
  | HttpError
  | PrismaError
  | ZodError;

export type ConcreteResult<T, E extends ConcreteErrorTypes> = Result<T, E>;

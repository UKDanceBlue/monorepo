import type { ApiError, ErrorApiResponse } from "@ukdanceblue/common";
import { ValidationError, errorResponseFrom } from "@ukdanceblue/common";
import type { HttpError } from "http-errors";
import createHttpError from "http-errors";
import type { DateTime, Duration, Interval } from "luxon";

import { logError } from "../logger.js";

export class LuxonError extends ValidationError {
  cause: Duration | Interval | DateTime;
  explanation: string | null;

  readonly name: string = "LuxonError";

  constructor(invalidLuxonObject: Duration | Interval | DateTime) {
    if (invalidLuxonObject.isValid || !invalidLuxonObject.invalidReason) {
      throw new Error("Tried to create an error from a valid Luxon object");
    }
    super(invalidLuxonObject.invalidReason);

    this.cause = invalidLuxonObject;
    this.explanation = invalidLuxonObject.invalidExplanation;
  }

  toHttpError(
    code: Exclude<keyof typeof createHttpError, "isHttpError"> = "400",
    expose = true
  ): [HttpError, ErrorApiResponse] {
    const httpError = createHttpError[code](this.message);
    httpError.expose = expose;
    httpError.name = this.name;
    httpError.cause = this.cause;
    const apiError: ApiError = {
      errorMessage: this.message,
      errorCause: this.cause,
    };
    if (this.explanation) apiError.errorExplanation = this.explanation;
    return [httpError, errorResponseFrom(apiError)];
  }
}

export class ParsingError extends ValidationError {
  cause?: object;

  readonly name: string = "ParsingError";

  constructor(message: string, cause?: object) {
    super("Error parsing body");

    this.message = message;
    if (cause) this.cause = cause;
  }

  toHttpError(
    code: Exclude<keyof typeof createHttpError, "isHttpError"> = "400",
    expose = true
  ): [HttpError, ErrorApiResponse] {
    const httpError = createHttpError[code](this.message);
    httpError.expose = expose;
    httpError.name = this.name;
    if (this.cause) httpError.cause = this.cause;
    return [httpError, errorResponseFrom({ errorMessage: this.message })];
  }
}

export class InvariantError extends Error {
  readonly name: string = "InvariantError";

  constructor(message: string) {
    super(message);
    logError("Invariant Violation", message);
  }

  toHttpError(
    code: Exclude<keyof typeof createHttpError, "isHttpError"> = "500",
    expose = true
  ): [HttpError, ErrorApiResponse] {
    const httpError = createHttpError[code](this.message);
    httpError.expose = expose;
    httpError.name = this.name;
    return [httpError, errorResponseFrom({ errorMessage: this.message })];
  }
}

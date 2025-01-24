import type { StatusCodes } from "http-status-codes";
import { getReasonPhrase } from "http-status-codes";

import { ExtendedError } from "./error.js";
import * as ErrorCode from "./errorCode.js";

export class HttpError<
  Code extends StatusCodes = StatusCodes,
> extends ExtendedError {
  constructor(public readonly code: Code) {
    super(getReasonPhrase(code));
  }

  readonly expose = true;

  get tag(): ErrorCode.HttpError {
    return ErrorCode.HttpError;
  }
}

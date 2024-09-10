import { ConcreteError } from "./error.js";
import * as ErrorCode from "./errorCode.js";

import { getReasonPhrase } from "http-status-codes";

import type { StatusCodes } from "http-status-codes";

export class HttpError<
  Code extends StatusCodes = StatusCodes,
> extends ConcreteError {
  constructor(readonly code: Code) {
    super();
  }

  get message(): string {
    return getReasonPhrase(this.code);
  }

  get expose(): boolean {
    return true;
  }

  get tag(): ErrorCode.HttpError {
    return ErrorCode.HttpError;
  }
}

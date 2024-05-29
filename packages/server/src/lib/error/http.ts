import type { StatusCodes } from "http-status-codes";
import { getReasonPhrase } from "http-status-codes";

import { ConcreteError } from "./error.js";

export class HttpError extends ConcreteError {
  readonly code: StatusCodes;

  constructor(code: StatusCodes | Response) {
    super();
    this.code = code instanceof Response ? code.status : code;
  }

  get message(): string {
    return getReasonPhrase(this.code);
  }

  get expose(): boolean {
    return true;
  }
}

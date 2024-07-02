import type { StatusCodes } from "http-status-codes";
import { getReasonPhrase } from "http-status-codes";

import { ConcreteError } from "./error.js";

const HttpErrorTag = Symbol("HttpError");
type HttpErrorTag = typeof HttpErrorTag;
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

  static get Tag(): HttpErrorTag {
    return HttpErrorTag;
  }
  get tag(): HttpErrorTag {
    return HttpErrorTag;
  }
}

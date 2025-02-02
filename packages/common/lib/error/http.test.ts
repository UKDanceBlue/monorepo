import { getReasonPhrase, StatusCodes } from "http-status-codes";
import { describe, expect, it } from "vitest";

import * as ErrorCode from "./errorCode.js";
import { HttpError } from "./http.js";

describe("HttpError", () => {
  it("should create an instance of HttpError with the correct code and message", () => {
    const code = StatusCodes.NOT_FOUND;
    const error = new HttpError(code);

    expect(error).toBeInstanceOf(HttpError);
    expect(error.code).toBe(code);
    expect(error.message).toBe(getReasonPhrase(code));
  });

  it("should have expose property set to true", () => {
    const code = StatusCodes.BAD_REQUEST;
    const error = new HttpError(code);

    expect(error.expose).toBe(true);
  });

  it("should return the correct tag", () => {
    const code = StatusCodes.INTERNAL_SERVER_ERROR;
    const error = new HttpError(code);

    expect(error.tag).toBe(ErrorCode.HttpError);
  });
});

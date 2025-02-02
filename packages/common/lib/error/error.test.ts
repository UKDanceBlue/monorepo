import { describe, expect, it } from "vitest";

import { JsError, toBasicError, UnknownError } from "./error.js";
import * as ErrorCode from "./errorCode.js";

describe("ExtendedError", () => {
  it("should create a JsError with correct properties", () => {
    const error = new Error("Test error");
    const jsError = new JsError(error);

    expect(jsError.message).toBe("Test error");
    expect(jsError.expose).toBe(false);
    expect(jsError.tag).toBe(ErrorCode.JsError);
    expect(jsError.stack).toBe(error.stack);
  });

  it("should create an UnknownError with default message", () => {
    const unknownError = new UnknownError();

    expect(unknownError.message).toBe("An unknown error occurred");
    expect(unknownError.expose).toBe(false);
    expect(unknownError.tag).toBe(ErrorCode.Unknown);
  });

  it("should create an UnknownError with a single message", () => {
    const unknownError = new UnknownError("Test unknown error");

    expect(unknownError.message).toBe("'Test unknown error'");
    expect(unknownError.expose).toBe(false);
    expect(unknownError.tag).toBe(ErrorCode.Unknown);
  });

  it("should create an UnknownError with multiple messages", () => {
    const unknownError = new UnknownError("Error 1", "Error 2");

    expect(unknownError.message).toBe(
      "Multiple errors occurred: 'Error 1', 'Error 2'"
    );
    expect(unknownError.expose).toBe(false);
    expect(unknownError.tag).toBe(ErrorCode.Unknown);
  });

  it("should convert an Error to a JsError using toBasicError", () => {
    const error = new Error("Test error");
    const basicError = toBasicError(error);

    expect(basicError).toBeInstanceOf(JsError);
    expect(basicError.message).toBe("Test error");
  });

  it("should convert a non-Error to an UnknownError using toBasicError", () => {
    const basicError = toBasicError("Test unknown error");

    expect(basicError).toBeInstanceOf(UnknownError);
    expect(basicError.message).toBe("'Test unknown error'");
  });
});

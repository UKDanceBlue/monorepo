import { describe, expect, it } from "vitest";

import { CompositeError } from "./composite.js";
import { ExtendedError } from "./error.js";
import * as ErrorCode from "./errorCode.js";
import type { ErrorCodeType } from "./index.js";

class MockError extends ExtendedError {
  constructor(
    message: string,
    private readonly _detailedMessage: string,
    public readonly expose: boolean
  ) {
    super(message, "MockError");
  }

  get tag(): ErrorCodeType {
    return ErrorCode.ActionDenied;
  }

  get detailedMessage() {
    return this._detailedMessage;
  }
}

describe("CompositeError", () => {
  it("should concatenate error messages", () => {
    const error1 = new MockError("Error 1", "Detailed Error 1", true);
    const error2 = new MockError("Error 2", "Detailed Error 2", false);
    const compositeError = new CompositeError([error1, error2]);

    expect(compositeError.message).toBe("Error 1, Error 2");
  });

  it("should concatenate detailed messages", () => {
    const error1 = new MockError("Error 1", "Detailed Error 1", true);
    const error2 = new MockError("Error 2", "Detailed Error 2", false);
    const compositeError = new CompositeError([error1, error2]);

    expect(compositeError.detailedMessage).toBe(
      "Detailed Error 1, Detailed Error 2"
    );
  });

  it("should expose if all errors are exposed", () => {
    const error1 = new MockError("Error 1", "Detailed Error 1", true);
    const error2 = new MockError("Error 2", "Detailed Error 2", true);
    const compositeError = new CompositeError([error1, error2]);

    expect(compositeError.expose).toBe(true);
  });

  it("should not expose if any error is not exposed", () => {
    const error1 = new MockError("Error 1", "Detailed Error 1", true);
    const error2 = new MockError("Error 2", "Detailed Error 2", false);
    const compositeError = new CompositeError([error1, error2]);

    expect(compositeError.expose).toBe(false);
  });

  it("should have the correct tag", () => {
    const error1 = new MockError("Error 1", "Detailed Error 1", true);
    const error2 = new MockError("Error 2", "Detailed Error 2", false);
    const compositeError = new CompositeError([error1, error2]);

    expect(compositeError.tag).toBe(ErrorCode.CompositeError);
  });
});

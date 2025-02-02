import { None, Some } from "ts-results-es";
import { describe, expect, it } from "vitest";

import {
  InvalidArgumentError,
  InvalidOperationError,
  InvalidStateError,
  InvariantError,
  NotFoundError,
  TimeoutError,
} from "./direct.js";
import * as ErrorCode from "./errorCode.js";

describe("NotFoundError", () => {
  it("should create an instance with default message", () => {
    const error = new NotFoundError();
    expect(error.message).toBe("Not found");
    expect(error.detailedMessage).toBe("Not found: Not found");
    expect(error.expose).toBe(true);
    expect(error.tag).toBe(ErrorCode.NotFound);
  });

  it("should create an instance with custom message", () => {
    const error = new NotFoundError("item", "location");
    expect(error.message).toBe("Not found: item");
    expect(error.detailedMessage).toBe("Not found: item in location");
    expect(error.expose).toBe(true);
    expect(error.tag).toBe(ErrorCode.NotFound);
  });

  it("should create an instance from Option", () => {
    const someOption = Some("value");
    const noneOption = None;

    const someResult = NotFoundError.fromOption(someOption);
    expect(someResult.isOk()).toBe(true);
    expect(someResult.unwrap()).toBe("value");

    const noneResult = NotFoundError.fromOption(noneOption, "item", "location");
    expect(noneResult.isErr()).toBe(true);
    expect(noneResult.unwrapErr()).toBeInstanceOf(NotFoundError);
  });
});

describe("TimeoutError", () => {
  it("should create an instance with default message", () => {
    const error = new TimeoutError();
    expect(error.message).toBe("A task took too long");
    expect(error.expose).toBe(false);
    expect(error.tag).toBe(ErrorCode.Timeout);
  });

  it("should create an instance with custom message", () => {
    const error = new TimeoutError("operation");
    expect(error.message).toBe("operation took too long");
    expect(error.expose).toBe(false);
    expect(error.tag).toBe(ErrorCode.Timeout);
  });
});

describe("InvalidOperationError", () => {
  it("should create an instance with custom message", () => {
    const error = new InvalidOperationError("operation");
    expect(error.message).toBe("Invalid operation: operation");
    expect(error.expose).toBe(false);
    expect(error.tag).toBe(ErrorCode.InvalidOperation);
  });
});

describe("InvalidArgumentError", () => {
  it("should create an instance with custom message", () => {
    const error = new InvalidArgumentError("argument");
    expect(error.message).toBe("Invalid argument: argument");
    expect(error.expose).toBe(false);
    expect(error.tag).toBe(ErrorCode.InvalidArgument);
  });
});

describe("InvalidStateError", () => {
  it("should create an instance with custom message", () => {
    const error = new InvalidStateError("state");
    expect(error.message).toBe("Invalid state: state");
    expect(error.expose).toBe(false);
    expect(error.tag).toBe(ErrorCode.InvalidState);
  });
});

describe("InvariantError", () => {
  it("should create an instance with custom message", () => {
    const error = new InvariantError("violation");
    expect(error.message).toBe("Invariant violation: violation");
    expect(error.expose).toBe(false);
    expect(error.tag).toBe(ErrorCode.InvariantViolation);
  });
});

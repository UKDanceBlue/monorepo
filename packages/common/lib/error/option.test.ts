import type { Result } from "ts-results-es";
import { Err, None, Ok, Some } from "ts-results-es";
import { describe, expect, it } from "vitest";

import { NotFoundError } from "./direct.js";
import { UnknownError } from "./error.js";
import { extractNotFound, optionOf } from "./option.js";

describe("optionOf", () => {
  it("should return Some when value is not null or undefined", () => {
    expect(optionOf(42)).toEqual(Some(42));
  });

  it("should return None when value is null", () => {
    expect(optionOf(null)).toEqual(None);
  });

  it("should return None when value is undefined", () => {
    expect(optionOf(undefined)).toEqual(None);
  });

  it("should return the same Option when value is an Option", () => {
    const someValue = Some(42);
    expect(optionOf(someValue)).toEqual(someValue);
  });
});

describe("extractNotFound", () => {
  it("should return Ok(None) when result is Err with NotFoundError", () => {
    const result: Result<number, NotFoundError> = Err(
      new NotFoundError("test")
    );
    expect(extractNotFound(result)).toEqual(Ok(None));
  });

  it("should return Err when result is Err with other error", () => {
    const result: Result<number, UnknownError> = Err(new UnknownError());
    expect(extractNotFound(result)).toEqual(result);
  });

  it("should return Ok(Some(value)) when result is Ok with value", () => {
    const result: Result<number, UnknownError> = Ok(42);
    expect(extractNotFound(result)).toEqual(Ok(Some(42)));
  });

  it("should return Ok(None) when result is Ok with null", () => {
    const result: Result<null, UnknownError> = Ok(null);
    expect(extractNotFound(result)).toEqual(Ok(None));
  });

  it("should return Ok(None) when result is Ok with undefined", () => {
    const result: Result<undefined, UnknownError> = Ok(undefined);
    expect(extractNotFound(result)).toEqual(Ok(None));
  });
});

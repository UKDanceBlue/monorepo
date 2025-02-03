import { describe, expect, it } from "vitest";

import { isNonNullable, stripNullish } from "./typeTransformers.js";

describe("stripNullish", () => {
  it("should remove nullish values from the object", () => {
    const input = { a: 1, b: null, c: undefined, d: "test" };
    const expectedOutput = { a: 1, d: "test" };
    const result = stripNullish(input);
    expect(result).toEqual(expectedOutput);
  });

  it("should return an empty object if all values are nullish", () => {
    const input = { a: null, b: undefined };
    const expectedOutput = {};
    const result = stripNullish(input);
    expect(result).toEqual(expectedOutput);
  });

  it("should return the same object if no values are nullish", () => {
    const input = { a: 1, b: "test", c: true };
    const expectedOutput = { a: 1, b: "test", c: true };
    const result = stripNullish(input);
    expect(result).toEqual(expectedOutput);
  });
});

describe("isNonNullable", () => {
  it("should return true for non-nullable values", () => {
    expect(isNonNullable(1)).toBe(true);
    expect(isNonNullable("test")).toBe(true);
    expect(isNonNullable(true)).toBe(true);
    expect(isNonNullable({})).toBe(true);
    expect(isNonNullable([])).toBe(true);
  });

  it("should return false for nullish values", () => {
    expect(isNonNullable(null)).toBe(false);
    expect(isNonNullable(undefined)).toBe(false);
  });
});

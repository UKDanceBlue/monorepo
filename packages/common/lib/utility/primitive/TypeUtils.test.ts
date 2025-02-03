import { describe, expect, it } from "vitest";

import { isArrayOf } from "./TypeUtils.js";

describe("isArrayOf", () => {
  it("should return true for an array of strings", () => {
    const value = ["a", "b", "c"];
    const result = isArrayOf(value, "string");
    expect(result).toBe(true);
  });

  it("should return true for an array of numbers", () => {
    const value = [1, 2, 3];
    const result = isArrayOf(value, "number");
    expect(result).toBe(true);
  });

  it("should return true for an array of booleans", () => {
    const value = [true, false, true];
    const result = isArrayOf(value, "boolean");
    expect(result).toBe(true);
  });

  it("should return false for an array of mixed types", () => {
    const value = [1, "a", true];
    const result = isArrayOf(value, "number");
    expect(result).toBe(false);
  });

  it("should return true for an empty array", () => {
    const value: unknown[] = [];
    const result = isArrayOf(value, "string");
    expect(result).toBe(true);
  });

  it("should return true for an array of objects", () => {
    const value = [{}, {}, {}];
    const result = isArrayOf(value, "object");
    expect(result).toBe(true);
  });

  it("should return report objects for an array including nulls", () => {
    const value = [{}, null, {}];
    const result = isArrayOf(value, "object");
    expect(result).toBe(true);
  });

  it("should return true for an array of symbols", () => {
    const value = [Symbol(), Symbol()];
    const result = isArrayOf(value, "symbol");
    expect(result).toBe(true);
  });

  it("should return true for an array of undefined", () => {
    const value = [undefined, undefined];
    const result = isArrayOf(value, "undefined");
    expect(result).toBe(true);
  });

  it("should return true for an array of bigints", () => {
    const value = [BigInt(1), BigInt(2)];
    const result = isArrayOf(value, "bigint");
    expect(result).toBe(true);
  });
});

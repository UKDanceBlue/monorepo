import { describe, expect, it } from "vitest";

import {
  arrayToBase64String,
  base64StringToArray,
  strToUTF8Arr,
  UTF8ArrToStr,
} from "./base64.js";

describe("base64StringToArray", () => {
  it("should convert base64 string to Uint8Array", () => {
    const base64 = "SGVsbG8gd29ybGQ=";
    const expected = new Uint8Array([
      72, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100,
    ]);
    const result = base64StringToArray(base64);
    expect(result).toEqual(expected);
  });
});

describe("arrayToBase64String", () => {
  it("should convert Uint8Array to base64 string", () => {
    const array = new Uint8Array([
      72, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100,
    ]);
    const expected = "SGVsbG8gd29ybGQ=";
    const result = arrayToBase64String(array);
    expect(result).toBe(expected);
  });
});

describe("UTF8ArrToStr", () => {
  it("should convert UTF-8 array to string", () => {
    const utf8Array = new Uint8Array([
      72, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100,
    ]);
    const expected = "Hello world";
    const result = UTF8ArrToStr(utf8Array);
    expect(result).toBe(expected);
  });
});

describe("strToUTF8Arr", () => {
  it("should convert string to UTF-8 array", () => {
    const str = "Hello world";
    const expected = new Uint8Array([
      72, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100,
    ]);
    const result = strToUTF8Arr(str);
    expect(result).toEqual(expected);
  });
});

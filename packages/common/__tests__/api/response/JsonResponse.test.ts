import { describe, expect, test } from "@jest/globals";

import type {
  ApiError,
  CreatedApiResponse,
  ErrorApiResponse,
  OkApiResponse,
} from ".././../../lib/api/response/JsonResponse";
import {
  createdResponseFrom,
  errorResponseFrom,
  okResponseFrom,
} from ".././../../lib/api/response/JsonResponse";

describe("okResponseFrom", () => {
  const correctResponse: OkApiResponse<string> = {
    ok: true,
  };

  test("returns an empty response if no value is given", () => {
    expect(okResponseFrom()).toEqual(correctResponse);
  });

  test("returns a response with the given value", () => {
    expect(okResponseFrom({ value: "test" })).toEqual({
      ...correctResponse,
      data: "test",
    });
  });
});

describe("createdResponseFrom", () => {
  const testId = "test-id";
  const correctResponse: CreatedApiResponse<string> = {
    ok: true,
    id: testId,
  };

  test("returns a response with the given id", () => {
    expect(createdResponseFrom({ id: testId })).toEqual(correctResponse);
  });

  test("returns a response with the given id and value", () => {
    expect(createdResponseFrom({ id: testId, value: "test" })).toEqual({
      ...correctResponse,
      data: "test",
    });
  });
});

describe("errorResponseFrom", () => {
  const correctErrorMessage = "test message";
  const correctResponse: ErrorApiResponse = {
    ok: false,
    errorMessage: correctErrorMessage,
  };
  const apiError: ApiError = {
    errorMessage: correctErrorMessage,
  };

  test("returns an error response with the given message", () => {
    expect(errorResponseFrom(apiError)).toEqual(correctResponse);
  });

  test("returns an error response with the given message and extra string info", () => {
    expect(
      errorResponseFrom({
        ...apiError,
        errorDetails: "Complex details",
        errorExplanation: "Simple details",
      })
    ).toEqual({
      ...correctResponse,
      errorDetails: "Complex details",
      errorExplanation: "Simple details",
    });
  });

  test("returns an error response with the given message and extra object info", () => {
    expect(
      errorResponseFrom({
        ...apiError,
        errorCause: { message: "Cause message" },
      })
    ).toEqual({
      ...correctResponse,
      errorCause: { message: "Cause message" },
    });
  });
});

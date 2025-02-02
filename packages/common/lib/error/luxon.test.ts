import { DateTime, Duration, Interval } from "luxon";
import { Ok } from "ts-results-es";
import { describe, expect, it } from "vitest";

import { ErrorCode } from "./index.js";
import { LuxonError } from "./luxon.js";

describe("LuxonError", () => {
  it("should return Ok for valid DateTime", () => {
    const validDateTime = DateTime.now();
    const result = LuxonError.luxonObjectToResult(validDateTime);
    expect(result).toEqual(Ok(validDateTime));
  });

  it("should return Err for invalid DateTime", () => {
    const invalidDateTime = DateTime.invalid("Invalid DateTime");
    const result = LuxonError.luxonObjectToResult(invalidDateTime);
    expect(result.isErr()).toBe(true);
  });

  it("should return Ok for valid Duration", () => {
    const validDuration = Duration.fromObject({ hours: 1 });
    const result = LuxonError.luxonObjectToResult(validDuration);
    expect(result).toEqual(Ok(validDuration));
  });

  it("should return Err for invalid Duration", () => {
    const invalidDuration = Duration.invalid("Invalid Duration");
    const result = LuxonError.luxonObjectToResult(invalidDuration);
    expect(result.isErr()).toBe(true);
  });

  it("should return Ok for valid Interval", () => {
    const validInterval = Interval.fromDateTimes(
      DateTime.now(),
      DateTime.now().plus({ hours: 1 })
    );
    const result = LuxonError.luxonObjectToResult(validInterval);
    expect(result).toEqual(Ok(validInterval));
  });

  it("should return Err for invalid Interval", () => {
    const invalidInterval = Interval.invalid("Invalid Interval");
    const result = LuxonError.luxonObjectToResult(invalidInterval);
    expect(result.isErr()).toBe(true);
  });

  it("should return detailedMessage for invalid DateTime", () => {
    const invalidDateTime = DateTime.invalid(
      "Invalid DateTime",
      "Invalid explanation"
    );
    const error = new LuxonError(invalidDateTime);
    expect(error.detailedMessage).toBe("Invalid explanation");
  });

  it("should return tag as error code LuxonError", () => {
    const invalidDateTime = DateTime.invalid("Invalid DateTime");
    const error = new LuxonError(invalidDateTime);
    expect(error.tag).toBe(ErrorCode.LuxonError);
  });

  it("should expose be true", () => {
    const invalidDateTime = DateTime.invalid("Invalid DateTime");
    const error = new LuxonError(invalidDateTime);
    expect(error.expose).toBe(true);
  });
});

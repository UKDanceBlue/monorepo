import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";

import { LuxonError } from "../../error/index.js";
import type { LocalDate } from "./localDate.js";
import {
  getFiscalYear,
  localDate,
  localDateFromJs,
  localDateFromLuxon,
  localDateToJs,
  localDateToLuxon,
} from "./localDate.js";

describe("localDate utility functions", () => {
  describe("localDate", () => {
    it("should return a valid LocalDate", () => {
      const result = localDate(2023, 10, 5);
      expect(result.isOk()).toBe(true);
      expect(result.unwrap()).toBe("2023-10-05");
    });

    it("should return an error for invalid date", () => {
      const result = localDate(2023, 13, 5);
      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr()).toBeInstanceOf(LuxonError);
    });
  });

  describe("localDateFromJs", () => {
    it("should convert JS Date to LocalDate", () => {
      const date = new Date(2023, 9, 5); // Month is 0-indexed
      const result = localDateFromJs(date);
      expect(result.isOk()).toBe(true);
      expect(result.unwrap()).toBe("2023-10-05");
    });

    it("should return an error for invalid JS Date", () => {
      const date = new Date("invalid date");
      const result = localDateFromJs(date);
      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr()).toBeInstanceOf(LuxonError);
    });
  });

  describe("localDateFromLuxon", () => {
    it("should convert Luxon DateTime to LocalDate", () => {
      const date = DateTime.fromObject({
        year: 2023,
        month: 10,
        day: 5,
      }) as DateTime<true>;
      const result = localDateFromLuxon(date);
      expect(result).toBe("2023-10-05");
    });
  });

  describe("localDateToJs", () => {
    it("should convert LocalDate to JS Date", () => {
      const localDate: LocalDate = "2023-10-05";
      const result = localDateToJs(localDate);
      expect(result).toEqual(new Date(2023, 9, 5)); // Month is 0-indexed
    });
  });

  describe("localDateToLuxon", () => {
    it("should convert LocalDate to Luxon DateTime", () => {
      const localDate: LocalDate = "2023-10-05";
      const result = localDateToLuxon(localDate);
      expect(result.isOk()).toBe(true);
      expect(result.unwrap().toISO()).toBe("2023-10-05T00:00:00.000-04:00");
    });

    it("should return an error for invalid LocalDate", () => {
      const localDate: LocalDate = "2023-13-05";
      const result = localDateToLuxon(localDate);
      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr()).toBeInstanceOf(LuxonError);
    });
  });

  describe("getFiscalYear", () => {
    it("should return the correct fiscal year interval", () => {
      const date = DateTime.fromObject({ year: 2023, month: 10, day: 5 });
      const interval = getFiscalYear(date);
      expect(interval.start!.toISO()).toBe("2023-07-01T00:00:00.000+00:00");
      expect(interval.end!.toISO()).toBe("2024-06-30T23:59:59.999+00:00");
    });

    it("should return the correct fiscal year interval for dates before July", () => {
      const date = DateTime.fromObject({ year: 2023, month: 5, day: 5 });
      const interval = getFiscalYear(date);
      expect(interval.start!.toISO()).toBe("2022-07-01T00:00:00.000+00:00");
      expect(interval.end!.toISO()).toBe("2023-06-30T23:59:59.999+00:00");
    });
  });
});

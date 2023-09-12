import { describe, expect, test } from "@jest/globals";
import { DateTime } from "luxon";

import {
  isBodyDateTime,
  isHtmlDateString,
  isHtmlDateTimeString,
  isHtmlMonthString,
  isHtmlTimeString,
  parseBodyDateTime,
  parseHtmlDateString,
  parseHtmlDateTimeString,
  parseHtmlMonthString,
  parseHtmlTimeString,
} from "../../lib/util/htmlDateTime";
import type { BodyDateTime } from "../../lib/util/htmlDateTime";

describe("isHtmlDateString", () => {
  test("returns true for a valid HTML date string", () => {
    expect(isHtmlDateString("2020-01-01")).toBe(true);
  });

  test("returns false for an invalid HTML date string", () => {
    expect(isHtmlDateString("2020-01-01T00:00:00Z")).toBe(false);
  });
});

describe("parseHtmlDateString", () => {
  test("parses a valid HTML date string", () => {
    expect(parseHtmlDateString("2020-01-01")).toEqual({
      year: 2020,
      month: 1,
      day: 1,
    });
  });

  test("throws an error for an invalid HTML date string", () => {
    expect(() => parseHtmlDateString("2020-01-01-9" as never)).toThrow();
  });
});

describe("isHtmlTimeString", () => {
  test("returns true for a valid HTML time string", () => {
    expect(isHtmlTimeString("00:00:00")).toBe(true);
  });

  test("returns false for an invalid HTML time string", () => {
    expect(isHtmlTimeString("2020-01-01T00:00:00Z")).toBe(false);
  });
});

describe("parseHtmlTimeString", () => {
  test("parses a valid HTML time string", () => {
    expect(parseHtmlTimeString("00:00:00")).toEqual({
      hour: 0,
      minute: 0,
      second: 0,
    });
  });

  test("throws an error for an invalid HTML time string", () => {
    expect(() =>
      parseHtmlTimeString("2020-01-01T00:00:00Z" as never)
    ).toThrow();
  });
});

describe("isHtmlDateTimeString", () => {
  test("returns true for a valid HTML date time string", () => {
    expect(isHtmlDateTimeString("2020-01-01T00:00:00")).toBe(true);
  });

  test("returns false for an invalid HTML date time string", () => {
    expect(isHtmlDateTimeString("2020-01-01")).toBe(false);
  });
});

describe("parseHtmlDateTimeString", () => {
  test("parses a valid HTML date time string", () => {
    expect(parseHtmlDateTimeString("2020-01-01T00:00:00")).toEqual({
      year: 2020,
      month: 1,
      day: 1,
      hour: 0,
      minute: 0,
      second: 0,
    });
  });

  test("throws an error for an invalid HTML date time string", () => {
    expect(() => parseHtmlDateTimeString("2020-01-01" as never)).toThrow();
  });
});

describe("isHtmlMonthString", () => {
  test("returns true for a valid HTML month string", () => {
    expect(isHtmlMonthString("2020-01")).toBe(true);
  });

  test("returns false for an invalid HTML month string", () => {
    expect(isHtmlMonthString("2020-01-01")).toBe(false);
  });
});

describe("parseHtmlMonthString", () => {
  test("parses a valid HTML month string", () => {
    expect(parseHtmlMonthString("2020-01")).toEqual({
      year: 2020,
      month: 1,
    });
  });

  test("throws an error for an invalid HTML month string", () => {
    expect(() => parseHtmlMonthString("2020-01-01" as never)).toThrow();
  });
});

describe("isBodyDateTime", () => {
  test("returns true for a valid BodyDateTime (date and time)", () => {
    const validBodyDateTime: BodyDateTime = {
      date: "2020-01-01",
      time: "00:00:00",
    };

    expect(isBodyDateTime(validBodyDateTime)).toBe(true);
  });

  test("returns true for a valid BodyDateTime (dateTimeString)", () => {
    const validBodyDateTime: BodyDateTime = {
      dateTimeString: "2020-01-01T00:00:00",
    };

    expect(isBodyDateTime(validBodyDateTime)).toBe(true);
  });

  test("returns true for an invalid BodyDateTime (date and time) w/ timezone", () => {
    const invalidBodyDateTime: BodyDateTime = {
      date: "2020-01-01",
      time: "00:00:00",
      timezone: "America/New_York",
    };

    expect(isBodyDateTime(invalidBodyDateTime)).toBe(true);
  });

  test("returns true for an invalid BodyDateTime (dateTimeString) w/ timezone", () => {
    const invalidBodyDateTime: BodyDateTime = {
      dateTimeString: "2020-01-01T00:00:00",
      timezone: "America/New_York",
    };

    expect(isBodyDateTime(invalidBodyDateTime)).toBe(true);
  });

  test("returns false for an invalid BodyDateTime", () => {
    expect(
      isBodyDateTime({ type: "date", value: "2020-01-01T00:00:00Z" })
    ).toBe(false);
  });
});

describe("parseBodyDateTime", () => {
  const janOneUtc = DateTime.fromObject(
    {
      year: 2020,
      month: 1,
      day: 1,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    },
    {
      zone: "utc",
    }
  );

  const JanOneNY = janOneUtc.setZone("America/New_York", {
    keepLocalTime: true,
  });

  test("parses a valid BodyDateTime (date and time)", () => {
    const validBodyDateTime: BodyDateTime = {
      date: "2020-01-01",
      time: "00:00:00.00",
    };

    const parsed = parseBodyDateTime(validBodyDateTime);

    expect(janOneUtc.equals(parsed)).toBe(true);
    expect(parsed.isValid).toBe(true);
  });

  test("parses a valid BodyDateTime (dateTimeString)", () => {
    const validBodyDateTime: BodyDateTime = {
      dateTimeString: "2020-01-01T00:00:00.00",
    };

    const parsed = parseBodyDateTime(validBodyDateTime);

    expect(janOneUtc.equals(parsed)).toBe(true);
    expect(parsed.isValid).toBe(true);
  });

  test("parses a valid BodyDateTime (date and time w/ time zone)", () => {
    const validBodyDateTime: BodyDateTime = {
      date: "2020-01-01",
      time: "00:00:00.00",
      timezone: "America/New_York",
    };

    const parsed = parseBodyDateTime(validBodyDateTime);

    expect(JanOneNY.equals(parsed)).toBe(true);
    expect(parsed.isValid).toBe(true);
  });

  test("parses a valid BodyDateTime (dateTimeString w/ time zone)", () => {
    const validBodyDateTime: BodyDateTime = {
      dateTimeString: "2020-01-01T00:00:00.00",
      timezone: "America/New_York",
    };

    const parsed = parseBodyDateTime(validBodyDateTime);

    expect(JanOneNY.equals(parsed)).toBe(true);
    expect(parsed.isValid).toBe(true);
  });

  test("parses a valid BodyDateTime (date and time) with default timezone", () => {
    const validBodyDateTime: BodyDateTime = {
      date: "2020-01-01",
      time: "00:00:00.00",
    };

    const parsed = parseBodyDateTime(validBodyDateTime, "America/New_York");

    expect(JanOneNY.equals(parsed)).toBe(true);
    expect(parsed.isValid).toBe(true);
  });

  test("parses a valid BodyDateTime (dateTimeString) with default timezone", () => {
    const validBodyDateTime: BodyDateTime = {
      dateTimeString: "2020-01-01T00:00:00.00",
    };

    const parsed = parseBodyDateTime(validBodyDateTime, "America/New_York");

    expect(JanOneNY.equals(parsed)).toBe(true);
    expect(parsed.isValid).toBe(true);
  });

  test("throws an error for an invalid BodyDateTime", () => {
    expect(() => parseBodyDateTime({} as never)).toThrow();
  });
});

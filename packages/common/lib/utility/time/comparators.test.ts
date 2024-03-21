import { DateTime, Interval } from "luxon";
import { describe, expect, it } from "vitest";

import { intervalComparator } from "./comparators.js";

describe("intervalComparator", () => {
  const earlyDate = DateTime.fromObject(
    {
      year: 2020,
      month: 3,
      day: 5,
      hour: 3,
      minute: 9,
      second: 0,
    },
    { zone: "utc" }
  );
  const midDate1 = DateTime.fromObject(
    {
      year: 2020,
      month: 5,
      day: 5,
      hour: 3,
      minute: 9,
      second: 0,
    },
    { zone: "utc" }
  );
  const midDate2 = DateTime.fromObject(
    {
      year: 2020,
      month: 5,
      day: 6,
      hour: 3,
      minute: 9,
      second: 0,
    },
    { zone: "utc" }
  );
  const lateDate = DateTime.fromObject(
    {
      year: 2020,
      month: 7,
      day: 6,
      hour: 6,
      minute: 2,
      second: 0,
    },
    { zone: "utc" }
  );

  // Fully bounded intervals:
  const testIntervalEarlyMid1 = Interval.fromDateTimes(earlyDate, midDate1);
  const testIntervalEarlyMid2 = Interval.fromDateTimes(earlyDate, midDate2);
  const testIntervalEarlyLate = Interval.fromDateTimes(earlyDate, lateDate);
  const testIntervalMid1Mid2 = Interval.fromDateTimes(midDate1, midDate2);
  const testIntervalMid1Late = Interval.fromDateTimes(midDate1, lateDate);
  const testIntervalMid2Late = Interval.fromDateTimes(midDate2, lateDate);

  // Invalid interval:
  const testIntervalMid2Mid1 = Interval.fromDateTimes(midDate2, midDate1);

  it("returns negative when the first interval's start is before and the ends are the same", () => {
    expect(
      intervalComparator(testIntervalEarlyMid2, testIntervalMid1Mid2)
    ).toBeLessThan(0);
    expect(
      intervalComparator(testIntervalMid1Late, testIntervalMid2Late)
    ).toBeLessThan(0);
  });

  it("returns positive when the first interval's start is after and the ends are the same", () => {
    expect(
      intervalComparator(testIntervalMid1Mid2, testIntervalEarlyMid2)
    ).toBeGreaterThan(0);
    expect(
      intervalComparator(testIntervalMid2Late, testIntervalMid1Late)
    ).toBeGreaterThan(0);
  });

  it("returns negative when the first interval's end is before and the starts are the same", () => {
    expect(
      intervalComparator(testIntervalEarlyMid1, testIntervalEarlyMid2)
    ).toBeLessThan(0);
    expect(
      intervalComparator(testIntervalMid1Mid2, testIntervalMid1Late)
    ).toBeLessThan(0);
  });

  it("returns positive when the first interval's end is after and the starts are the same", () => {
    expect(
      intervalComparator(testIntervalEarlyMid2, testIntervalEarlyMid1)
    ).toBeGreaterThan(0);
    expect(
      intervalComparator(testIntervalMid1Late, testIntervalMid1Mid2)
    ).toBeGreaterThan(0);
  });

  it("returns negative when the first interval engulfs the second", () => {
    expect(
      intervalComparator(testIntervalEarlyLate, testIntervalMid1Mid2)
    ).toBeLessThan(0);
    expect(
      intervalComparator(testIntervalEarlyLate, testIntervalMid1Late)
    ).toBeLessThan(0);
    expect(
      intervalComparator(testIntervalEarlyLate, testIntervalMid2Late)
    ).toBeLessThan(0);
  });

  it("returns 0 when the intervals are the same", () => {
    expect(
      intervalComparator(testIntervalEarlyMid1, testIntervalEarlyMid1)
    ).toBe(0);
  });

  it("throws an error for an invalid interval", () => {
    expect(() =>
      intervalComparator(testIntervalEarlyMid1, testIntervalMid2Mid1)
    ).toThrow("Invalid interval");

    expect(() =>
      intervalComparator(testIntervalMid2Mid1, testIntervalEarlyMid1)
    ).toThrow("Invalid interval");

    expect(() =>
      intervalComparator(testIntervalMid2Mid1, testIntervalMid2Mid1)
    ).toThrow("Invalid interval");
  });
});

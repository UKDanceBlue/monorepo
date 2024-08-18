import { validateInterval } from "./intervalTools.js";

import { DateTime, Interval } from "luxon";
import { describe, expect, it } from "vitest";


const firstDateTime = DateTime.fromObject({ year: 2020 });
const secondDateTime = DateTime.fromObject({ year: 2021 });

const validInterval = Interval.fromDateTimes(firstDateTime, secondDateTime);

const invalidInterval = Interval.fromDateTimes(secondDateTime, firstDateTime);

describe("validateInterval", () => {
  it("returns valid for a valid interval", () => {
    const result = validateInterval(validInterval);
    expect(result.valid).toBe(true);
    expect(result.interval).toBeDefined();
  });

  it("returns invalid for an invalid interval", () => {
    const result = validateInterval(invalidInterval);
    expect(result.valid).toBe(false);
    expect(result.interval).toBeUndefined();
  });
});

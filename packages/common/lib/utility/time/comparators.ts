import type { Interval } from "luxon";

import { validateInterval } from "./intervalTools.js";

/**
 * This comparator considers the UTC timestamp of the intervals.
 *
 * @param intervalA The first interval
 * @param intervalB The second interval
 * @return A number representing the difference between the intervals (almost always -1, 0, or 1)
 */
export function intervalComparator(
  intervalA: Interval,
  intervalB: Interval
): number {
  const { interval: a, valid: validA } = validateInterval(intervalA);
  const { interval: b, valid: validB } = validateInterval(intervalB);
  if (!validA || !validB) {
    throw new Error("Invalid interval");
  }

  // Check the start of the intervals
  if (!a.start.equals(b.start)) {
    // If they are different, find out by how much
    const startDiff = a.start.toMillis() - b.start.toMillis();
    // ..and return the sign of the difference
    return Math.sign(startDiff);
  }

  // Check the end of the intervals
  if (!a.end.equals(b.end)) {
    // If they are different, find out by how much
    const endDiff = a.end.toMillis() - b.end.toMillis();
    // ..and return the sign of the difference
    return Math.sign(endDiff);
  }

  return 0;
}

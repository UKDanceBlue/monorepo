import type { Interval } from "luxon";

type ValidInterval = Interval & {
  start: NonNullable<Interval["start"]>;
  end: NonNullable<Interval["end"]>;
};

/**
 * Validates an interval and returns it as a valid interval with start and end
 *
 * @param interval The interval to validate
 * @return The validated interval in a wrapper object
 */
export function validateInterval(
  interval: Interval
):
  | { valid: false; interval: undefined }
  | { valid: true; interval: ValidInterval } {
  if (!interval.isValid || !interval.start || !interval.end) {
    return { valid: false, interval: undefined };
  }

  return {
    valid: true,
    interval: interval as ValidInterval,
  };
}

import type { Interval } from "luxon";
import { DateTime } from "luxon";

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

export function dateTimeFromSomething(
  something: string | number | Date | DateTime
): DateTime<true>;
export function dateTimeFromSomething(something: null): null;
export function dateTimeFromSomething(something: undefined): undefined;
export function dateTimeFromSomething(
  something: string | number | Date | DateTime | null
): DateTime<true> | null;
export function dateTimeFromSomething(
  something: string | number | Date | DateTime | undefined
): DateTime<true> | undefined;
export function dateTimeFromSomething(
  something: string | number | Date | DateTime | null | undefined
): DateTime<true> | null | undefined;
export function dateTimeFromSomething(
  something: string | number | Date | DateTime | null | undefined
): DateTime<true> | null | undefined {
  if (something == null) {
    return something;
  }
  let dateTime = null;
  switch (typeof something) {
    case "string": {
      dateTime = DateTime.fromISO(something);
      break;
    }
    case "number": {
      dateTime = DateTime.fromMillis(something);
      break;
    }
    case "object": {
      dateTime =
        something instanceof Date
          ? DateTime.fromJSDate(something)
          : DateTime.isDateTime(something)
            ? something
            : DateTime.invalid("Invalid input type for dateTimeFromSomething");
      break;
    }
    default: {
      dateTime = DateTime.invalid(
        "Invalid input type for dateTimeFromSomething"
      );
      break;
    }
  }

  return dateTime.isValid ? dateTime : null;
}

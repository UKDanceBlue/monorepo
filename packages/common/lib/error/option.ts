import { None, Some } from "ts-results-es";

import type { Option } from "ts-results-es";

export function optionOf<T>(value: T | null | undefined): Option<T> {
  return value == null ? None : Some(value);
}

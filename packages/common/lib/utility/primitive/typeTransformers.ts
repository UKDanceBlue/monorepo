import type { NullishToOptional } from "./TypeUtils.js";

export function stripNullish<
  T extends Record<string | number | symbol, unknown>,
>(data: T): NullishToOptional<T> {
  const result: NullishToOptional<T> = {} as NullishToOptional<T>;

  for (const key of Object.keys(data)) {
    if (data[key] != null) {
      // @ts-expect-error Dunno what the problem is here, but it seems fine
      result[key] = data[key];
    }
  }

  return result;
}

export function isNonNullable<T>(data: T): data is NonNullable<T> {
  return data != null;
}

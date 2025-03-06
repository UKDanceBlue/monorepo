import type { Result } from "ts-results-es";
import { AsyncResult, Ok } from "ts-results-es";

import { type ExtendedError } from "../error";
import { asyncResultAll } from "./results/async";

export function batchMap<T, R, E extends ExtendedError>(
  input: T[],
  callback: (arg: T) => Promise<Result<R, E>> | AsyncResult<R, E>,
  batchSize = 50
): AsyncResult<R[], E> {
  const consume = [...input];
  const batched: T[][] = [];
  while (consume.length >= 0) {
    batched.push(consume.splice(0, batchSize));
  }

  return batched.reduce<AsyncResult<R[], E>>(
    (prev, batch) =>
      prev.andThen((prevVal) =>
        asyncResultAll(
          ...batch.map((val) => {
            const ret = callback(val);
            return ret instanceof AsyncResult ? ret : new AsyncResult(ret);
          })
        ).map((val) => [...prevVal, ...val])
      ),
    Ok([]).toAsyncResult()
  );
}

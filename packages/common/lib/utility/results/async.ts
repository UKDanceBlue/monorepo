/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ResultErrTypes, ResultOkTypes } from "ts-results-es";
import { AsyncResult, Result } from "ts-results-es";

type AsyncResultsToResult<T> = {
  [K in keyof T]: T[K] extends AsyncResult<infer Ok, infer Err>
    ? Result<Ok, Err>
    : never;
};

export function asyncResultAll<const T extends AsyncResult<any, any>[]>(
  ...results: T
): AsyncResult<
  ResultOkTypes<AsyncResultsToResult<T>>,
  ResultErrTypes<AsyncResultsToResult<T>>[number]
>;
export function asyncResultAll<T extends AsyncResult<any, any>[]>(
  ...results: T
): AsyncResult<
  ResultOkTypes<AsyncResultsToResult<T>>,
  ResultErrTypes<AsyncResultsToResult<T>>[number]
>;
export function asyncResultAll<T extends AsyncResult<any, any>[]>(
  ...results: T
): AsyncResult<
  ResultOkTypes<AsyncResultsToResult<T>>,
  ResultErrTypes<AsyncResultsToResult<T>>[number]
> {
  return new AsyncResult(
    Promise.all(results.map((result) => result.promise)).then((results) =>
      Result.all(results)
    ) as Promise<
      Result<
        ResultOkTypes<AsyncResultsToResult<T>>,
        ResultErrTypes<AsyncResultsToResult<T>>[number]
      >
    >
  );
}

import type { BasicError } from "@ukdanceblue/common/error";
import { toBasicError } from "@ukdanceblue/common/error";
import { useEffect, useState } from "react";
import type { Option } from "ts-results-es";
import { type AsyncResult, type Result } from "ts-results-es";

export function useResult<T, E>(
  result: Result<T, E>
):
  | {
      data: T;
    }
  | {
      error: E;
    } {
  return result.isOk() ? { data: result.value } : { error: result.error };
}

export function useAsyncResult<T, E>(
  result: AsyncResult<T, E>
):
  | {
      data: T;
    }
  | {
      error: E | BasicError;
    }
  | undefined {
  const [val, setVal] = useState<{ data: T } | { error: E | BasicError }>();

  useEffect(() => {
    result.promise
      .then((res) => {
        setVal(res.isOk() ? { data: res.value } : { error: res.error });
      })
      .catch((error) => {
        setVal({ error: toBasicError(error) });
      });
  }, [result]);

  return val;
}

export function useOption<T>(option: Option<T>): T | undefined {
  return option.unwrapOr(undefined);
}

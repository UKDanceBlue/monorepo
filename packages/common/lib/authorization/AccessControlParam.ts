import type { GraphQLResolveInfo } from "graphql";
import { type AsyncResult, type Result } from "ts-results-es";

import type { ExtendedError } from "../error/error.js";
import type { Action, Subject, SubjectObject } from "./accessControl.js";

type MaybeCallback<T> =
  | MaybeResult<T>
  | ((
      info: GraphQLResolveInfo,
      args: Record<string, unknown>,
      root?: Record<string, unknown>
    ) => MaybeResult<T>);
type MaybeResult<T> =
  | T
  | Result<T, ExtendedError>
  | AsyncResult<T, ExtendedError>;

export type AccessControlParam<
  S extends Exclude<Extract<Subject, string>, "all">,
> = [
  action: Action,
  subject: MaybeCallback<{ id?: string | string[]; kind: S }> | "all",
  field:
    | keyof Pick<SubjectObject<S>, `.${string}` & keyof SubjectObject<S>>
    | ".",
];

export function getArrayFromOverloadedRest<T>(
  overloadedArray: (T | readonly T[])[]
): T[] {
  const items: T[] = Array.isArray(overloadedArray[0])
    ? (overloadedArray[0] as T[])
    : (overloadedArray as T[]);
  return items;
}

export const _aclSummary = new Map<string, string[]>();
export function addAclSummary(
  constructorName: string,
  propertyKey: string,
  action: string,
  kindStr: string,
  kindSpecifier = ""
) {
  if (
    "process" in globalThis &&
    "versions" in globalThis.process &&
    "node" in globalThis.process.versions
  ) {
    if (!_aclSummary.has(constructorName)) {
      _aclSummary.set(constructorName, []);
    }
    _aclSummary
      .get(constructorName)!
      .push(`### ${propertyKey}\n**${action}** ${kindStr}${kindSpecifier}`);
  }
}

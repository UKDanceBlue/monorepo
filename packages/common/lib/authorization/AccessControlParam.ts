/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import type { GraphQLResolveInfo } from "graphql";
import { type AsyncResult, Err, type Result } from "ts-results-es";
import * as TypeGraphql from "type-graphql";

import { assertGlobalId } from "../api/scalars/GlobalId.js";
import { InvalidArgumentError } from "../error/direct.js";
import type { ConcreteError } from "../error/error.js";
import type { Action, Subject } from "./accessControl.js";

type MaybeCallback<T> =
  | MaybeResult<T>
  | ((
      info: GraphQLResolveInfo,
      args: Record<string, unknown>,
      root?: Record<string, unknown>
    ) => MaybeResult<T>);
type MaybeResult<T> =
  | T
  | Result<T, ConcreteError>
  | AsyncResult<T, ConcreteError>;

type SubjectObject<S extends Exclude<Extract<Subject, string>, "all">> =
  Readonly<
    Extract<
      Subject,
      {
        kind: S;
      }
    >
  >;

export type AccessControlParam<
  S extends Exclude<Extract<Subject, string>, "all">,
> = [
  action: Action,
  subject: MaybeCallback<{ id?: string; kind: S }> | "all",
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

export function AccessControlAuthorized<
  S extends Exclude<Extract<Subject, string>, "all">,
>(
  action: AccessControlParam<S>[0],
  subjectOrMacro:
    | AccessControlParam<S>[1]
    | ["all"]
    | ["getId", S, string]
    | ["getIdFromRoot", S, string]
    | ["every", S],
  field: AccessControlParam<S>[2] = "."
): PropertyDecorator & MethodDecorator & ClassDecorator {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!TypeGraphql.getMetadataStorage) {
    return () => undefined;
  }

  return (
    target: Function | object,
    propertyKey?: string | symbol,
    _descriptor?: TypedPropertyDescriptor<any>
  ) => {
    let subject: AccessControlParam<S>[1];
    if (Array.isArray(subjectOrMacro)) {
      // We need to add a util handler
      switch (subjectOrMacro[0]) {
        case "getId": {
          const kind = subjectOrMacro[1];
          const idField = subjectOrMacro[2];
          subject = (_: unknown, args: Record<string, unknown>) => {
            const id = assertGlobalId(args[idField]);
            return id.map(({ id }) => ({ id, kind }));
          };
          break;
        }
        case "getIdFromRoot": {
          const kind = subjectOrMacro[1];
          const idField = subjectOrMacro[2];
          subject = (
            _1: unknown,
            _2: unknown,
            root?: Record<string, unknown>
          ) => {
            if (root == null) {
              return Err(new InvalidArgumentError("Root is missing"));
            }
            const id = assertGlobalId(root[idField]);
            return id.map(({ id }) => ({ id, kind }));
          };
          break;
        }
        case "every": {
          const kind = subjectOrMacro[1];
          subject = { kind };
          break;
        }
        case "all": {
          subject = "all";
          break;
        }
        default: {
          subjectOrMacro[0] satisfies never;
          throw new Error("Invalid macro");
        }
      }
    } else {
      subject = subjectOrMacro === "all" ? "all" : subjectOrMacro;
    }

    const role: AccessControlParam<S> = [action, subject, field];
    if (propertyKey == null) {
      TypeGraphql.getMetadataStorage().collectAuthorizedResolverMetadata({
        target: target as Function,
        roles: [role],
      });
      return;
    }

    if (typeof propertyKey === "symbol") {
      throw new TypeGraphql.SymbolKeysNotSupportedError();
    }

    TypeGraphql.getMetadataStorage().collectAuthorizedFieldMetadata({
      target: target.constructor,
      fieldName: propertyKey,
      roles: [role],
    });
  };
}

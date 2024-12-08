/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import * as TypeGraphql from "type-graphql";

import type { AppAbility } from "./accessControl.js";

export type AccessControlParam<AllowShortForm = true> =
  AllowShortForm extends true
    ? Parameters<AppAbility["can"]> | [Parameters<AppAbility["can"]>[0]]
    : Parameters<AppAbility["can"]>;

export function getArrayFromOverloadedRest<T>(
  overloadedArray: (T | readonly T[])[]
): T[] {
  const items: T[] = Array.isArray(overloadedArray[0])
    ? (overloadedArray[0] as T[])
    : (overloadedArray as T[]);
  return items;
}

const authSummary: Record<
  string,
  Record<
    string,
    {
      action: string;
      subject: string;
      field: string;
    }
  >
> = {};

// setTimeout(() => {
//   console.log(
//     Object.entries(authSummary)
//       .map(
//         ([k, v]) =>
//           `<h2>${k}</h2><dl>${Object.entries(v)
//             .map(
//               ([n, { action, subject, field }]) =>
//                 `<dt><b>${n}</b></dt><dd><i>${action}</i> ${subject}${field}</dd>`
//             )
//             .join("")}</dl>`
//       )
//       .join("")
//   );
// }, 3000);

export function AccessControlAuthorized(
  ...check: AccessControlParam
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
    if (propertyKey == null) {
      TypeGraphql.getMetadataStorage().collectAuthorizedResolverMetadata({
        target: target as Function,
        roles: [check],
      });
      return;
    }

    if (typeof propertyKey === "symbol") {
      throw new TypeGraphql.SymbolKeysNotSupportedError();
    }

    authSummary[target.constructor.name] = {
      ...authSummary[target.constructor.name],
      [propertyKey]: {
        action: check[0],
        subject: check[1]
          ? typeof check[1] === "string"
            ? check[1]
            : `${check[1].kind}[id=${check[1].id}]`
          : target.constructor.name.replace(/Resolver$/, "Node"),
        field: check[2] ?? ".",
      },
    };

    TypeGraphql.getMetadataStorage().collectAuthorizedFieldMetadata({
      target: target.constructor,
      fieldName: propertyKey,
      roles: [check],
    });
  };
}

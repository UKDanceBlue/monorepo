import { Authorized } from "type-graphql";

import type { AppAbility } from "./accessControl.js";

export type AccessControlParam<AllowShortForm = true> =
  AllowShortForm extends true
    ? Parameters<AppAbility["can"]> | [Parameters<AppAbility["can"]>[0]]
    : Parameters<AppAbility["can"]>;

export function AccessControlAuthorized(
  ...check: AccessControlParam
): PropertyDecorator & MethodDecorator & ClassDecorator {
  return Authorized<AccessControlParam>(check);
}

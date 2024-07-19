import type { AuthorizationRule } from "@ukdanceblue/common";
import { prettyPrintAuthorizationRule } from "@ukdanceblue/common";

import { ConcreteError } from "./error.js";

/**
 * These errors are caused when the server can do something, but doesn't want to. For example
 * when a user tries to do something they aren't allowed to do, or when a notification is cancelled
 * after it's already been sent.
 *
 * Exposed by default.
 */
export abstract class ControlError extends ConcreteError {
  abstract get message(): string;
  get detailedMessage(): string {
    return this.message;
  }
  get expose() {
    return true;
  }
  get stack(): string | undefined {
    return undefined;
  }
}

const UnauthorizedErrorTag = Symbol("UnauthorizedError");
type UnauthorizedErrorTag = typeof UnauthorizedErrorTag;
export class UnauthorizedError extends ControlError {
  get message() {
    return "Unauthorized";
  }

  constructor(protected readonly requiredAuthorization: AuthorizationRule[]) {
    super();
  }

  get detailedMessage() {
    return `Unauthorized: ${this.requiredAuthorization.map(prettyPrintAuthorizationRule).join(", ")}`;
  }

  static get Tag(): UnauthorizedErrorTag {
    return UnauthorizedErrorTag;
  }
  get tag(): UnauthorizedErrorTag {
    return UnauthorizedErrorTag;
  }
}

const UnauthenticatedErrorTag = Symbol("UnauthenticatedError");
type UnauthenticatedErrorTag = typeof UnauthenticatedErrorTag;
export class UnauthenticatedError extends ControlError {
  get message() {
    return "Unauthenticated";
  }

  static get Tag(): UnauthenticatedErrorTag {
    return UnauthenticatedErrorTag;
  }
  get tag(): UnauthenticatedErrorTag {
    return UnauthenticatedErrorTag;
  }
}

const ActionDeniedErrorTag = Symbol("ActionDeniedError");
type ActionDeniedErrorTag = typeof ActionDeniedErrorTag;
export class ActionDeniedError extends ControlError {
  constructor(protected readonly action: string) {
    super();
  }

  get message() {
    return `Action denied: ${this.action}`;
  }

  static get Tag(): ActionDeniedErrorTag {
    return ActionDeniedErrorTag;
  }
  get tag(): ActionDeniedErrorTag {
    return ActionDeniedErrorTag;
  }
}

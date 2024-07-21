import type { AuthorizationRule } from "@ukdanceblue/common";
import { prettyPrintAuthorizationRule } from "@ukdanceblue/common";

import { ConcreteError } from "./error.js";
import * as ErrorCode from "./errorCode.js";

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

  get tag(): ErrorCode.Unauthorized {
    return ErrorCode.Unauthorized;
  }
}

export class UnauthenticatedError extends ControlError {
  get message() {
    return "Unauthenticated";
  }

  get tag(): ErrorCode.Unauthenticated {
    return ErrorCode.Unauthenticated;
  }
}

export class ActionDeniedError extends ControlError {
  constructor(protected readonly action: string) {
    super();
  }

  get message() {
    return `Action denied: ${this.action}`;
  }

  get tag(): ErrorCode.ActionDenied {
    return ErrorCode.ActionDenied;
  }
}

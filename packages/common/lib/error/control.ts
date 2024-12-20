import type { GraphQLResolveInfo } from "graphql";
import type { Path } from "graphql/jsutils/Path.js";

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
  readonly expose = true;
  get stack(): string | undefined {
    return undefined;
  }
}

export class AuthorizationRuleFailedError extends ControlError {
  readonly message = "Unauthorized";

  // eslint-disable-next-line @typescript-eslint/class-literal-property-style
  get detailedMessage() {
    return `You do not have access to this resource`;
  }

  get tag(): ErrorCode.AuthorizationRuleFailed {
    return ErrorCode.AuthorizationRuleFailed;
  }
}

export class AccessControlError extends ControlError {
  constructor(protected readonly info: GraphQLResolveInfo) {
    super();
  }

  protected errorPath() {
    let locationString = this.info.path.key;
    let pathSegment: typeof this.info.path.prev = this.info.path.prev;
    while (pathSegment) {
      locationString = `${pathSegment.key}.${locationString}`;
      pathSegment = pathSegment.prev;
    }
    return locationString;
  }

  get message() {
    return `Access denied to ${this.info.fieldName} at ${this.errorPath()}`;
  }

  get detailedMessage() {
    let path = "";
    let pathIter: Path | undefined = this.info.path;
    while (pathIter) {
      path = `${path}.${pathIter.key}`;
      pathIter = pathIter.prev;
    }
    return `Access denied to ${this.info.fieldName} (${this.info.returnType.toString()}) at ${this.errorPath()} within ${this.info.operation.operation} ${this.info.operation.name?.value ?? "unknown operation"}`;
  }

  readonly expose = true;

  get tag(): ErrorCode.AccessControlError {
    return ErrorCode.AccessControlError;
  }
}

export class UnauthenticatedError extends ControlError {
  readonly message = "Unauthenticated";

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

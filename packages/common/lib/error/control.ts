import { ExtendedError } from "./error.js";
import * as ErrorCode from "./errorCode.js";

/**
 * These errors are caused when the server can do something, but doesn't want to. For example
 * when a user tries to do something they aren't allowed to do, or when a notification is cancelled
 * after it's already been sent.
 *
 * Exposed by default.
 */
export abstract class ControlError extends ExtendedError {
  get detailedMessage(): string {
    return this.message;
  }
  readonly expose = true;
}

export class UnauthenticatedError extends ControlError {
  constructor(message?: string) {
    super(
      message ? `Unauthenticated: ${message}` : "Unauthenticated",
      ErrorCode.Unauthenticated.description
    );
  }

  get tag(): ErrorCode.Unauthenticated {
    return ErrorCode.Unauthenticated;
  }
}

export class UnauthorizedError extends ControlError {
  constructor(message?: string) {
    super(
      message ? `Unauthorized: ${message}` : "Unauthorized",
      ErrorCode.Unauthorized.description
    );
  }

  get tag(): ErrorCode.Unauthenticated {
    return ErrorCode.Unauthenticated;
  }
}

export class ActionDeniedError extends ControlError {
  constructor(protected readonly action: string) {
    super(`Action denied: ${action}`);
  }

  get tag(): ErrorCode.ActionDenied {
    return ErrorCode.ActionDenied;
  }
}

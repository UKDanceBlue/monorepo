import { logError } from "../logger.js";

export class InvariantError extends Error {
  readonly name: string = "InvariantError";

  constructor(message: string) {
    super(message);
    logError("Invariant Violation", message);
  }
}

import { logger } from "../logger.js";

export class InvariantError extends Error {
  readonly name: string = "InvariantError";

  constructor(message: string) {
    super(message);
    logger.error("Invariant Violation", message);
  }
}

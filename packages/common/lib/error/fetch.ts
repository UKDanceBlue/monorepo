import type { Result } from "ts-results-es";
import { Err, Ok } from "ts-results-es";

import type { BasicError } from "./error.js";
import { ConcreteError, toBasicError } from "./error.js";
import { ErrorCode } from "./index.js";

export class FetchError extends ConcreteError {
  readonly #response: Response;
  readonly #url: string | undefined = undefined;
  #responseText: string | undefined = undefined;

  constructor(response: Response, url?: string | URL) {
    super();
    this.#response = response;
    this.#url = url?.toString();
  }

  get message(): string {
    return `Fetch failed with status ${this.#response.status}: ${this.#response.statusText}`;
  }

  get detailedMessage(): string {
    return `Fetch for ${this.#url ?? "unknown URL"} failed with status ${this.#response.status}: ${this.#response.statusText}`;
  }

  async getResponseText(): Promise<string | undefined> {
    if (this.#responseText != null) {
      return this.#responseText;
    } else if (this.#response.bodyUsed) {
      return undefined;
    } else {
      this.#responseText = await this.#response.clone().text();
      return this.#responseText;
    }
  }

  readonly expose = false;

  get tag(): ErrorCode.FetchError {
    return ErrorCode.FetchError;
  }

  static async safeFetch(
    request: string | URL | Request,
    init?: RequestInit
  ): Promise<Result<Response, FetchError | BasicError>> {
    try {
      const response = await fetch(request, init);
      return !response.ok
        ? Err(
            new FetchError(
              response,
              request instanceof Request ? request.url : request
            )
          )
        : Ok(response);
    } catch (error) {
      return Err(toBasicError(error));
    }
  }
}

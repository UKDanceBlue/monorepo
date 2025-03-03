import type { Duration } from "luxon";

export class CachedValue<T> {
  private readonly ttlMs: number;

  constructor(
    private readonly fetcher: () => Promise<T> | T,
    ttl: Duration
  ) {
    this.ttlMs = ttl.as("milliseconds");
  }

  private value: T | undefined;
  private lastFetchTime: number | undefined;

  async get(): Promise<T> {
    if (
      this.value === undefined ||
      this.lastFetchTime === undefined ||
      Date.now() - this.lastFetchTime > this.ttlMs
    ) {
      this.value = await this.fetcher();
      this.lastFetchTime = Date.now();
    }
    return this.value;
  }
}

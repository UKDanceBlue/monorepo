import { Err, Ok } from "ts-results-es";
import { describe, expect, it, vi } from "vitest";

import { FetchError } from "./fetch.js";
import { ErrorCode } from "./index.js";

describe("FetchError", () => {
  const mockResponse = new Response("Not Found", {
    status: 404,
    statusText: "Not Found",
  });

  it("should create an instance of FetchError", () => {
    const fetchError = new FetchError(mockResponse, "http://example.com");
    expect(fetchError).toBeInstanceOf(FetchError);
    expect(fetchError.response).toBe(mockResponse);
    expect(fetchError.url).toBe("http://example.com");
    expect(fetchError.message).toBe("Fetch failed with status 404: Not Found");
    expect(fetchError.detailedMessage).toBe(
      "Fetch for http://example.com failed with status 404: Not Found"
    );
    expect(fetchError.expose).toBe(false);
    expect(fetchError.tag).toBe(ErrorCode.FetchError);
  });

  it("should return detailed message", () => {
    const fetchError = new FetchError(mockResponse, "http://example.com");
    expect(fetchError.detailedMessage).toBe(
      "Fetch for http://example.com failed with status 404: Not Found"
    );
  });

  it("should return response text", async () => {
    const fetchError = new FetchError(mockResponse, "http://example.com");
    const responseText = await fetchError.getResponseText();
    expect(responseText).toBe("Not Found");
  });

  it("should return undefined if response body is used", async () => {
    const usedResponse = new Response("Not Found", {
      status: 404,
      statusText: "Not Found",
    });
    await usedResponse.text(); // Consume the body
    const fetchError = new FetchError(usedResponse, "http://example.com");
    const responseText = await fetchError.getResponseText();
    expect(responseText).toBeUndefined();
  });

  describe("safeFetch", () => {
    it("should return Ok if fetch is successful", async () => {
      const mockFetch = vi
        .fn()
        .mockResolvedValue(new Response("OK", { status: 200 }));
      global.fetch = mockFetch;

      const result = await FetchError.safeFetch("http://example.com");
      expect(result).toBeInstanceOf(Ok);
      expect(result.unwrap().status).toBe(200);
    });

    it("should return Err if fetch fails", async () => {
      const mockFetch = vi.fn().mockResolvedValue(mockResponse);
      global.fetch = mockFetch;

      const result = await FetchError.safeFetch("http://example.com");
      expect(result).toBeInstanceOf(Err);
      const fetchError = result.unwrapErr();
      expect(fetchError).toBeInstanceOf(FetchError);
      expect((fetchError as FetchError).response).toBe(mockResponse);
    });

    it("should return Err if fetch throws an error", async () => {
      const mockFetch = vi.fn().mockRejectedValue(new Error("Network Error"));
      global.fetch = mockFetch;

      const result = await FetchError.safeFetch("http://example.com");
      expect(result).toBeInstanceOf(Err);
      const basicError = result.unwrapErr();
      expect(basicError.message).toBe("Network Error");
    });
  });
});

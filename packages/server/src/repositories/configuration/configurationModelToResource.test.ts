import type { Configuration } from "@prisma/client";
import { ConfigurationNode } from "@ukdanceblue/common";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";

import { configurationModelToResource } from "./configurationModelToResource.js";

describe("configurationModelToResource", () => {
  it("should convert a configuration model to a configuration node resource", () => {
    const configuration: Configuration = {
      id: 1,
      uuid: "123",
      key: "testKey",
      value: "testValue",
      validAfter: new Date("2023-01-01T00:00:00.000Z"),
      validUntil: new Date("2023-12-31T23:59:59.999Z"),
      createdAt: new Date("2022-01-01T00:00:00.000Z"),
      updatedAt: new Date("2022-06-01T00:00:00.000Z"),
    };

    const result = configurationModelToResource(configuration);

    expect(result).toBeInstanceOf(ConfigurationNode);
    expect(result.id.typename).toBe("ConfigurationNode");
    expect(result.id.id).toBe(configuration.uuid);
    expect(result.key).toBe(configuration.key);
    expect(result.value).toBe(configuration.value);
    expect(result.validAfter).toEqual(
      DateTime.fromJSDate(configuration.validAfter!)
    );
    expect(result.validUntil).toEqual(
      DateTime.fromJSDate(configuration.validUntil!)
    );
    expect(result.createdAt).toEqual(
      DateTime.fromJSDate(configuration.createdAt)
    );
    expect(result.updatedAt).toEqual(
      DateTime.fromJSDate(configuration.updatedAt)
    );
  });

  it("should handle null validAfter and validUntil fields", () => {
    const configuration: Configuration = {
      id: 1,
      uuid: "123",
      key: "testKey",
      value: "testValue",
      validAfter: null,
      validUntil: null,
      createdAt: new Date("2022-01-01T00:00:00.000Z"),
      updatedAt: new Date("2022-06-01T00:00:00.000Z"),
    };

    const result = configurationModelToResource(configuration);

    expect(result).toBeInstanceOf(ConfigurationNode);
    expect(result.id.typename).toBe("ConfigurationNode");
    expect(result.id.id).toBe(configuration.uuid);
    expect(result.key).toBe(configuration.key);
    expect(result.value).toBe(configuration.value);
    expect(result.validAfter).toBeNull();
    expect(result.validUntil).toBeNull();
    expect(result.createdAt).toEqual(
      DateTime.fromJSDate(configuration.createdAt)
    );
    expect(result.updatedAt).toEqual(
      DateTime.fromJSDate(configuration.updatedAt)
    );
  });
});

import { deviceModelToResource } from "./deviceModelToResource.js";

import { DeviceNode } from "@ukdanceblue/common";
import { describe, expect, it } from "vitest";

import type { Device } from "@prisma/client";


describe("deviceModelToResource", () => {
  it("maps a device model to a resource", () => {
    const deviceModel: Device = {
      id: 1,
      uuid: "uuid",
      expoPushToken: "token",
      lastSeen: new Date("2021-01-01T00:00:00Z"),
      lastSeenPersonId: 1,
      verifier: "verifier",
      createdAt: new Date("2021-01-01T00:00:00Z"),
      updatedAt: new Date("2021-01-01T00:00:00Z"),
    };

    const resource = deviceModelToResource(deviceModel);

    expect(resource).toBeInstanceOf(DeviceNode);
    expect(resource).toStrictEqual(
      DeviceNode.init({
        id: "uuid",
        lastLogin: new Date("2021-01-01T00:00:00Z"),
        createdAt: new Date("2021-01-01T00:00:00Z"),
        updatedAt: new Date("2021-01-01T00:00:00Z"),
      })
    );
  });

  it("maps a device model to a resource with null values", () => {
    const deviceModel: Device = {
      id: 1,
      uuid: "uuid",
      expoPushToken: "token",
      lastSeen: null,
      lastSeenPersonId: null,
      verifier: null,
      createdAt: new Date("2021-01-01T00:00:00Z"),
      updatedAt: new Date("2021-01-01T00:00:00Z"),
    };

    const resource = deviceModelToResource(deviceModel);

    expect(resource).toStrictEqual(
      DeviceNode.init({
        id: "uuid",
        lastLogin: null,
        createdAt: new Date("2021-01-01T00:00:00Z"),
        updatedAt: new Date("2021-01-01T00:00:00Z"),
      })
    );
  });
});

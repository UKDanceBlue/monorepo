import { beforeEach, describe, expect, it } from "vitest";

import { makePrismaMock } from "../../testing/PrismaMock.js";
import { DeviceRepository } from "./DeviceRepository.js";

describe("deviceRepository", () => {
  const { prismaMock, resetMocks } = makePrismaMock();

  beforeEach(() => {
    resetMocks();
  });

  it("lookupNotificationAudience('all')", async () => {
    expect.hasAssertions();

    const deviceRepository = new DeviceRepository(
      prismaMock.prismaClient,
      null as never
    );

    prismaMock.device.findMany.mockResolvedValueOnce([
      {
        id: 1,
        uuid: "uuid1",
        expoPushToken: "tokenA",
      },
      {
        id: 2,
        uuid: "uuid2",
        expoPushToken: "tokenB",
      },
      {
        id: 3,
        uuid: "uuid3",
        expoPushToken: "tokenB",
      },
    ]);

    const result = await deviceRepository.lookupNotificationAudience("all");

    expect(result).toStrictEqual([
      {
        id: 1,
        uuid: "uuid1",
        expoPushToken: "tokenA",
      },
      {
        id: 3,
        uuid: "uuid3",
        expoPushToken: "tokenB",
      },
    ]);

    expect(prismaMock.device.findMany).toHaveBeenCalledWith({
      select: { id: true, uuid: true, expoPushToken: true },
      where: { AND: [{ expoPushToken: { not: null } }] },
      orderBy: { lastSeen: "asc" },
    });

    expect(prismaMock.device.findMany).toHaveBeenCalledTimes(1);
  });

  it("lookupNotificationAudience(*)", async () => {
    expect.hasAssertions();

    const deviceRepository = new DeviceRepository(
      prismaMock.prismaClient,
      null as never
    );

    await expect(() =>
      deviceRepository.lookupNotificationAudience({})
    ).rejects.toThrow("Not implemented");

    expect(prismaMock.device.findMany).toHaveBeenCalledTimes(0);
  });
});

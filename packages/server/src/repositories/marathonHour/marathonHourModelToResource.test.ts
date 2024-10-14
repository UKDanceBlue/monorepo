import { marathonHourModelToResource } from "./marathonHourModelToResource.js";

import { MarathonHourNode } from "@ukdanceblue/common";
import { describe, it } from "vitest";

import type { MarathonHour } from "@prisma/client";

describe("marathonHourModelToResource", () => {
  it("should correctly transform MarathonHour to MarathonHourNode", ({
    expect,
  }) => {
    const now = new Date();
    const marathonHourModel: MarathonHour = {
      id: 0,
      marathonId: 0,
      uuid: "test-uuid",
      title: "test-title",
      details: "test-details",
      durationInfo: "test-durationInfo",
      shownStartingAt: now,
      createdAt: now,
      updatedAt: now,
    };

    const result = marathonHourModelToResource(marathonHourModel);

    const nowString = now.toISOString();

    expect(result).toBeInstanceOf(MarathonHourNode);
    expect(result.id.id).toBe("test-uuid");
    expect(result.title).toBe("test-title");
    expect(result.details).toBe("test-details");
    expect(result.durationInfo).toBe("test-durationInfo");
    expect(result.shownStartingAt.toISOString()).toBe(nowString);
    expect(result.createdAt).toBe(now);
    expect(result.updatedAt).toBe(now);
  });
});

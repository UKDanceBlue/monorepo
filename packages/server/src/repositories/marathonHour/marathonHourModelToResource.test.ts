import type { MarathonHour } from "@prisma/client";
import { MarathonHourResource } from "@ukdanceblue/common";
import { describe, expect, it } from "vitest";

import { marathonHourModelToResource } from "./marathonHourModelToResource.js";

describe("marathonHourModelToResource", () => {
  it("should correctly transform MarathonHour to MarathonHourResource", () => {
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

    expect(result).toBeInstanceOf(MarathonHourResource);
    expect(result.uuid).toBe("test-uuid");
    expect(result.title).toBe("test-title");
    expect(result.details).toBe("test-details");
    expect(result.durationInfo).toBe("test-durationInfo");
    expect(result.shownStartingAt).toBe(nowString);
    expect(result.createdAt).toBe(now);
    expect(result.updatedAt).toBe(now);
  });
});

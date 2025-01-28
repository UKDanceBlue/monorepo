import type { MarathonHour } from "@prisma/client";
import { MarathonHourNode } from "@ukdanceblue/common";
import { DateTime } from "luxon";
import { describe, it } from "vitest";

import { marathonHourModelToResource } from "./marathonHourModelToResource.js";

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

    const nowString = DateTime.fromJSDate(now).toISO();

    expect(result).toBeInstanceOf(MarathonHourNode);
    expect(result.id.id).toBe("test-uuid");
    expect(result.title).toBe("test-title");
    expect(result.details).toBe("test-details");
    expect(result.durationInfo).toBe("test-durationInfo");
    expect(result.shownStartingAt.toISO()).toBe(nowString);
    expect(result.createdAt.toISO()).toBe(nowString);
    expect(result.updatedAt.toISO()).toBe(nowString);
  });

  it("Should not add any additional properties", ({ expect }) => {
    const marathonHourModel: MarathonHour = {
      // @ts-expect-error - Test extra property
      extraProperty: "extra",
    };

    const result = marathonHourModelToResource(marathonHourModel);

    expect(result).not.toHaveProperty("extraProperty");
  });
});

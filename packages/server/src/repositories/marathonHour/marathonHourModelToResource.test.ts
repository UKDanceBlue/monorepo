import { MarathonHourNode } from "@ukdanceblue/common";
import type { InferSelectModel } from "drizzle-orm";
import { DateTime } from "luxon";
import { describe, it } from "vitest";

import type { marathonHour } from "#schema/tables/marathon.sql.js";

import { marathonHourModelToResource } from "./marathonHourModelToResource.js";

describe("marathonHourModelToResource", () => {
  it("should correctly transform MarathonHour to MarathonHourNode", ({
    expect,
  }) => {
    const now = DateTime.now();
    const marathonHourModel: InferSelectModel<typeof marathonHour> = {
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

    const nowString = now.toISO();

    expect(result).toBeInstanceOf(MarathonHourNode);
    expect(result.id.id).toBe("test-uuid");
    expect(result.title).toBe("test-title");
    expect(result.details).toBe("test-details");
    expect(result.durationInfo).toBe("test-durationInfo");
    expect(result.shownStartingAt.toISO()).toBe(nowString);
    expect(result.createdAt).toBe(now);
    expect(result.updatedAt).toBe(now);
  });
});

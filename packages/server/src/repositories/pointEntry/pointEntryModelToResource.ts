import type { PointEntry } from "@prisma/client";
import { PointEntryNode } from "@ukdanceblue/common";
import { DateTime } from "luxon";

export function pointEntryModelToResource(
  pointEntryModel: PointEntry
): PointEntryNode {
  return PointEntryNode.init({
    id: pointEntryModel.uuid,
    points: pointEntryModel.points,
    comment: pointEntryModel.comment,
    createdAt: DateTime.fromJSDate(pointEntryModel.createdAt),
    updatedAt: DateTime.fromJSDate(pointEntryModel.updatedAt),
  });
}

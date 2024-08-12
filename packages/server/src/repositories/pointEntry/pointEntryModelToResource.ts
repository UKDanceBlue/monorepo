import { PointEntryNode } from "@ukdanceblue/common";

import type { PointEntry } from "@prisma/client";

export function pointEntryModelToResource(
  pointEntryModel: PointEntry
): PointEntryNode {
  return PointEntryNode.init({
    id: pointEntryModel.uuid,
    points: pointEntryModel.points,
    comment: pointEntryModel.comment,
    createdAt: pointEntryModel.createdAt,
    updatedAt: pointEntryModel.updatedAt,
  });
}

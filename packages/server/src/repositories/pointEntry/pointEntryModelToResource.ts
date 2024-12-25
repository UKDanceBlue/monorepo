import { PointEntryNode } from "@ukdanceblue/common";

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

import type { PointEntry } from "@prisma/client";
import { PointEntryResource } from "@ukdanceblue/common";

export function pointEntryModelToResource(pointEntryModel: PointEntry): PointEntryResource {
  return PointEntryResource.init({
    uuid: pointEntryModel.uuid,
  });
}

import type { Image } from "@prisma/client";
import { ImageResource } from "@ukdanceblue/common";

export function imageModelToResource(imageModel: Image): ImageResource {
  return ImageResource.init({
    uuid: imageModel.uuid,
  });
}

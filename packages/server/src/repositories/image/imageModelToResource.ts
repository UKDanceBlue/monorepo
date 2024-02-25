import type { Image } from "@prisma/client";
import { ImageResource } from "@ukdanceblue/common";

export function imageModelToResource(imageModel: Image): ImageResource {
  return ImageResource.init({
    uuid: imageModel.uuid,
    url: imageModel.url ? new URL(imageModel.url) : null,
    imageData: imageModel.imageData?.toString("base64"),
    mimeType: imageModel.mimeType ?? undefined,
    thumbHash: imageModel.thumbHash?.toString("base64"),
    alt: imageModel.alt ?? undefined,
    width: imageModel.width,
    height: imageModel.height,
    createdAt: imageModel.createdAt,
    updatedAt: imageModel.updatedAt,
  });
}

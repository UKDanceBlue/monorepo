import { ImageNode } from "@ukdanceblue/common";

import type { FileManager } from "#files/FileManager.js";
import { combineMimePartsToString } from "#files/mime.js";

export async function imageModelToResource(
  imageModel: Image,
  fileModel: File | undefined | null,
  fileManager: FileManager,
  serverUrl: URL
): Promise<ImageNode> {
  let fileData:
    | {
        url: URL;
        mimeType: string;
      }
    | undefined = undefined;

  if (fileModel) {
    const externalUrl = await fileManager.getExternalUrl(fileModel, serverUrl);
    if (externalUrl) {
      fileData = {
        url: externalUrl,
        mimeType: combineMimePartsToString(
          fileModel.mimeTypeName,
          fileModel.mimeSubtypeName,
          fileModel.mimeParameters
        ),
      };
    }
  }

  return ImageNode.init({
    id: imageModel.uuid,
    url: fileData?.url ?? null,
    mimeType: fileData?.mimeType ?? "application/octet-stream", // "application/octet-stream" is the default MIME type if the file is not found
    thumbHash: imageModel.thumbHash?.toString("base64"),
    alt: imageModel.alt ?? undefined,
    width: imageModel.width,
    height: imageModel.height,
    createdAt: imageModel.createdAt,
    updatedAt: imageModel.updatedAt,
  });
}

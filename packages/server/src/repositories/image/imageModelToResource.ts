import type { File, Image } from "@prisma/client";
import { ImageNode } from "@ukdanceblue/common";
import { DateTime } from "luxon";
import { AsyncResult, Ok } from "ts-results-es";

import type { FileManager } from "#files/FileManager.js";
import { combineMimePartsToString } from "#files/mime.js";
import {
  type AsyncRepositoryResult,
  handleRepositoryError,
} from "#repositories/shared.js";

export function imageModelToResource(
  imageModel: Image,
  fileModel: File | undefined | null,
  fileManager: FileManager,
  serverUrl: URL
): AsyncRepositoryResult<ImageNode> {
  const fileData = fileModel
    ? new AsyncResult(
        fileManager.getExternalUrl(fileModel, serverUrl).then(
          (url) => Ok(url),
          (error) => handleRepositoryError(error)
        )
      ).map((url) => ({
        url,
        mimeType: combineMimePartsToString(
          fileModel.mimeTypeName,
          fileModel.mimeSubtypeName,
          fileModel.mimeParameters
        ),
      }))
    : Ok(null).toAsyncResult();

  return fileData.map((fileData) =>
    ImageNode.init({
      id: imageModel.uuid,
      url: fileData?.url ?? null,
      mimeType: fileData?.mimeType ?? "application/octet-stream", // "application/octet-stream" is the default MIME type if the file is not found
      thumbHash:
        imageModel.thumbHash &&
        Buffer.from(imageModel.thumbHash).toString("base64"),
      alt: imageModel.alt ?? undefined,
      width: imageModel.width,
      height: imageModel.height,
      createdAt: DateTime.fromJSDate(imageModel.createdAt),
      updatedAt: DateTime.fromJSDate(imageModel.updatedAt),
    })
  );
}

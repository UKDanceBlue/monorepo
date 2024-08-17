import { maxFileSize } from "#environment";

import { FileManager } from "#files/FileManager.js";
import { generateThumbHash } from "#lib/thumbHash.js";
import { logger } from "#logging/standardLogging.js";
import { ImageRepository } from "#repositories/image/ImageRepository.js";

import Router from "@koa/router";
import { koaBody } from "koa-body";
import { Container } from "typedi";

import { open } from "fs/promises";

import type { File } from "@prisma/client";




const uploadRouter = new Router({ prefix: "/upload" }).post(
  "/image/:uuid",
  koaBody({
    multipart: true,
    formidable: {
      allowEmptyFiles: false,
    },
  }),
  async (ctx) => {
    const imageRepository = Container.get(ImageRepository);
    const fileManager = Container.get(FileManager);

    const { uuid } = ctx.params;

    // Check the image in the database
    if (!uuid) {
      return ctx.throw(400, "No image UUID provided");
    }
    const dbImage = await imageRepository.findImageByUnique({ uuid });
    if (!dbImage) {
      return ctx.throw(404, "Image not found");
    }

    // Check the uploaded file
    const uploadedFiles = ctx.request.files
      ? Object.values(ctx.request.files)
      : [];
    if (uploadedFiles.length === 0) {
      return ctx.throw(400, "No image uploaded");
    } else if (uploadedFiles.length > 1) {
      return ctx.throw(400, "Only one image can be uploaded at a time");
    }

    const uploadedFile = uploadedFiles[0];
    if (uploadedFiles.length === 0 || !uploadedFile) {
      return ctx.throw(400, "No image uploaded");
    }
    if (uploadedFiles.length > 1 || Array.isArray(uploadedFile)) {
      return ctx.throw(400, "Only one image can be uploaded at a time");
    }

    if (uploadedFile.size * 1024 * 1024 > maxFileSize) {
      return ctx.throw(400, "File too large");
    }

    const {
      thumbHash: thumbHashArray,
      height,
      width,
    } = await generateThumbHash(uploadedFile.filepath);

    const thumbHash = Buffer.from(thumbHashArray);

    let file: File;
    try {
      const tmpFileHandle = await open(uploadedFile.filepath);
      try {
        file = await fileManager.storeFile(
          {
            type: "stream",
            name: uploadedFile.originalFilename ?? uploadedFile.newFilename,
            stream: tmpFileHandle.createReadStream({
              autoClose: true,
              emitClose: true,
            }),
          },
          uploadedFile.mimetype ?? "application/octet-stream",
          // TODO: Implement file ownership
          undefined,
          undefined,
          "local"
        );
      } finally {
        await tmpFileHandle.close();
      }
    } catch (error) {
      logger.warning("Error while storing file", { error });
      return ctx.throw(500, "Error while storing file");
    }

    try {
      await imageRepository.updateImage(
        {
          uuid,
        },
        {
          file: {
            connect: {
              id: file.id,
            },
          },
          thumbHash,
          width,
          height,
        }
      );
    } catch (error) {
      // Roll back file creation
      await fileManager.deleteFile({ id: file.id });

      // Log and throw error
      logger.warning("Error while updating image", { error });
      return ctx.throw(500, "Error while updating image");
    }

    ctx.status = 204;
  }
);

export default uploadRouter;

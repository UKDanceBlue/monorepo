import { open } from "fs/promises";

import Router from "@koa/router";
import type { File } from "@prisma/client";
import { koaBody } from "koa-body";
import { Container } from "typedi";

import { FileManager } from "../../../lib/files/FileManager.js";
import { logger } from "../../../lib/logging/standardLogging.js";
import { ImageRepository } from "../../../repositories/image/ImageRepository.js";

const uploadRouter = new Router({ prefix: "/upload" });

// Multipart image upload
uploadRouter.post(
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

    const image = ctx.request.files?.image;

    if (!image) {
      return ctx.throw(400, "No image uploaded");
    }
    if (Array.isArray(image)) {
      return ctx.throw(400, "Only one file can be attached to an image");
    }
    if (!uuid) {
      return ctx.throw(400, "No image UUID provided");
    }
    const dbImage = await imageRepository.findImageByUnique({ uuid });

    if (!dbImage) {
      return ctx.throw(404, "Image not found");
    }

    let file: File;
    try {
      const tmpFileHandle = await open(image.filepath);
      try {
        file = await fileManager.storeFile(
          {
            type: "stream",
            name: image.originalFilename ?? image.newFilename,
            stream: tmpFileHandle.createReadStream({
              autoClose: true,
              emitClose: true,
            }),
          },
          image.mimetype ?? "application/octet-stream",
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
        }
      );
    } catch (error) {
      // Roll back file creation
      await fileManager.deleteFile({ id: file.id });

      // Log and throw error
      logger.warning("Error while updating image", { error });
      return ctx.throw(500, "Error while updating image");
    }
  }
);

export default uploadRouter;

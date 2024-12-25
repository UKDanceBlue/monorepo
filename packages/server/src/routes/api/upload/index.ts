import { Container, Service } from "@freshgum/typedi";
import { open } from "fs/promises";
import multer from "multer";

import { FileManager } from "#files/FileManager.js";
import { generateThumbHash } from "#lib/thumbHash.js";
import { maxFileSizeToken } from "#lib/typediTokens.js";
import { logger } from "#logging/standardLogging.js";
import { ImageRepository } from "#repositories/image/ImageRepository.js";
import { RouterService } from "#routes/RouteService.js";

const maxFileSize = Container.get(maxFileSizeToken);

const upload = multer({
  limits: { fileSize: maxFileSize * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"));
    }
    cb(null, true);
  },
});

@Service([ImageRepository, FileManager])
export default class HealthCheckRouter extends RouterService {
  constructor(imageRepository: ImageRepository, fileManager: FileManager) {
    super("/upload");

    this.addPostRoute(
      "/image/:uuid",
      upload.single("file"),
      async (req, res, next): Promise<void> => {
        try {
          const { uuid } = req.params;

          // Check the image in the database
          if (!uuid) {
            return void res.status(400).send("No image UUID provided");
          }
          const dbImage = await imageRepository.findImageByUnique({ uuid });
          if (!dbImage) {
            return void res.status(404).send("Image not found");
          }

          // Check the uploaded file
          const uploadedFile = req.file;
          if (!uploadedFile) {
            return void res.status(400).send("No image uploaded");
          }

          const {
            thumbHash: thumbHashArray,
            height,
            width,
          } = await generateThumbHash({ data: uploadedFile.path });

          const thumbHash = Buffer.from(thumbHashArray);

          let file: File;
          try {
            const tmpFileHandle = await open(uploadedFile.path);
            try {
              file = await fileManager.storeFile(
                {
                  type: "stream",
                  name: uploadedFile.originalname,
                  stream: tmpFileHandle.createReadStream({
                    autoClose: true,
                    emitClose: true,
                  }),
                },
                uploadedFile.mimetype,
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
            return void res.status(500).send("Error while storing file");
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
            return void res.status(500).send("Error while updating image");
          }

          return void res.status(204).send();
        } catch (error) {
          next(error);
        }
      }
    );
  }
}

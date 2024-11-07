import { Service } from "@freshgum/typedi";
import type { FileHandle } from "fs/promises";
import { mkdir, open, stat, unlink } from "fs/promises";
import { DateTime } from "luxon";
import { format, join, resolve } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import type { MIMEType } from "util";

import { servePath, uploadPath } from "#environment";
import { logger } from "#logging/standardLogging.js";

import type {
  StorableFile,
  StorageProvider,
  UnsupportedAccessMethod,
} from "./StorageProvider.js";
import { BaseStorageProvider } from "./StorageProvider.js";

/**
 * Determines if the location a path refers to is within `servePath`
 *
 * All access to files should be guarded by this function to prevent access to files outside of the `servePath`
 * as this could be a major security risk (i.e. serving configuration files or overwriting system files)
 */
function isPathAllowed(path: string): boolean {
  const resolvedPath = resolve(path);
  const resolvedServePath = resolve(servePath);
  return resolvedPath.startsWith(resolvedServePath);
}

@Service([])
export class LocalStorageProvider
  extends BaseStorageProvider
  implements StorageProvider
{
  supportedProtocols = ["file"];

  supportsMimeType(mimeType: string | MIMEType): boolean {
    const mimeString = mimeType.toString();
    return mimeString.startsWith("image/") || mimeString === "application/pdf";
  }

  async tryStreamFile(
    url: URL
  ): Promise<NodeJS.ReadableStream | typeof UnsupportedAccessMethod | null> {
    let handle: FileHandle | null = null;
    let stream: NodeJS.ReadableStream;
    try {
      const path = fileURLToPath(url);
      if (!isPathAllowed(path)) {
        throw new Error("Access to this file is not permitted");
      }

      handle = await open(path);
      const stats = await handle.stat();
      if (!stats.isFile()) {
        return null;
      }
      stream = handle.createReadStream({ autoClose: true, emitClose: true });
    } catch (error) {
      await handle?.close();
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "ENOENT"
      ) {
        return null;
      } else {
        logger.error("Error while streaming file", { error });
        throw new Error("Error while streaming file");
      }
    }
    return stream;
  }

  async storeFile(file: StorableFile): Promise<URL> {
    try {
      const { year, month } = DateTime.now().toObject();
      const yearPath = resolve(uploadPath, year.toString());
      try {
        await mkdir(yearPath, { recursive: false });
      } catch (error) {
        if (
          error instanceof Error &&
          "code" in error &&
          error.code === "EEXIST"
        ) {
          // Do nothing, the directory already exists
        } else {
          throw error;
        }
      }
      const monthPath = join(yearPath, month.toString().padStart(2, "0"));
      try {
        await mkdir(monthPath, { recursive: false });
      } catch (error) {
        if (
          error instanceof Error &&
          "code" in error &&
          error.code === "EEXIST"
        ) {
          // Do nothing, the directory already exists
        } else {
          throw error;
        }
      }

      const random = Math.random().toString(36).slice(2);
      const filename = `${random}-${file.name}`;
      const finalPath = format({
        dir: monthPath,
        base: filename,
      });

      if (!isPathAllowed(finalPath)) {
        throw new Error("Access to this location is not permitted");
      }

      const handle = await open(finalPath, "w");
      try {
        switch (file.type) {
          case "buffer": {
            await handle.write(file.buffer);
            break;
          }
          case "stream": {
            await new Promise((resolve, reject) => {
              file.stream
                .pipe(handle.createWriteStream({ autoClose: true }))
                .on("finish", resolve)
                .on("error", reject);
            });
            break;
          }
          default: {
            file satisfies never;
          }
        }
      } finally {
        await handle.close();
      }

      // Double check that the file was created
      try {
        await stat(finalPath);
      } catch (error) {
        logger.error("File can not be found on disk after writing");
        throw error;
      }

      return pathToFileURL(finalPath);
    } catch (error) {
      logger.error("Error while storing file", { error });
      throw new Error("Error while storing file");
    }
  }

  async deleteFile(url: URL): Promise<void> {
    try {
      const path = fileURLToPath(url);

      if (!isPathAllowed(path)) {
        throw new Error("Access to this location is not permitted");
      }

      await unlink(path);
    } catch (error) {
      logger.error("Error while deleting file", { error });
      throw new Error("Error while deleting file");
    }
  }
}

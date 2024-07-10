import { MIMEType } from "util";

import type { File } from "@prisma/client";
import { Service } from "typedi";

import { LocalStorageProvider } from "./storage/LocalStorageProvider.js";
import type {
  StorableFile,
  StorageProvider,
} from "./storage/StorageProvider.js";
import { UnsupportedAccessMethod } from "./storage/StorageProvider.js";
import { serveOrigin } from "#environment";
import { logger } from "#logging/standardLogging.js";
import { FileRepository } from "#repositories/file/fileRepository.js";

const FILE_API = new URL("/api/file/download/", serveOrigin);

logger.info(`Serving files from ${FILE_API.href}`);

@Service()
export class FileManager {
  constructor(
    private localStorage: LocalStorageProvider,
    private fileRepository: FileRepository
  ) {}

  /**
   * Store a file in storage
   * @param fileOrUrl The file to store, or a URL to keep in the database directly
   * @param mimeType The MIME type of the file
   * @param owner The owner of the file
   * @param requiresLogin Whether the file requires login to access
   * @param target The target storage location
   * @returns The file record
   * @throws Error if the file cannot be stored
   */
  async storeFile(
    fileOrUrl:
      | StorableFile
      | {
          type: "url";
          url: URL;
          name: string;
        },
    mimeType: MIMEType | string,
    owner?: { id: number } | { uuid: string },
    requiresLogin?: boolean,
    target: "local" = "local"
  ) {
    let locationUrl: URL;

    if (fileOrUrl.type === "url") {
      locationUrl = fileOrUrl.url;
    } else {
      let storageProvider: StorageProvider;
      switch (target) {
        case "local": {
          storageProvider = this.localStorage;
          break;
        }
        default: {
          target satisfies never;
          throw new Error("Invalid target");
        }
      }
      if (!storageProvider.supportsMimeType(mimeType)) {
        throw new Error("Unsupported MIME type");
      }
      locationUrl = await storageProvider.storeFile(fileOrUrl);
    }

    return this.fileRepository.createFile({
      filename: fileOrUrl.name,
      locationUrl,
      mimeType:
        typeof mimeType === "string" ? new MIMEType(mimeType) : mimeType,
      owner,
      requiresLogin,
    });
  }

  /**
   * Delete a file from storage
   * @param param The file to delete
   * @throws Error if the file does not exist or delete is not supported for the file's location
   */
  async deleteFile(param: { id: number } | { uuid: string }) {
    const file = await this.fileRepository.findFileByUnique(param);
    if (!file) {
      return;
    }
    const locationUrl = new URL(file.locationUrl);
    switch (locationUrl.protocol) {
      case "file": {
        await this.localStorage.deleteFile(locationUrl);
        break;
      }
      default: {
        throw new Error("Unsupported protocol");
      }
    }
    await this.fileRepository.deleteFile(param);
  }

  /**
   * Get an external HTTP(S) URL for a file
   * @param file The file to get the URL for
   * @returns The external URL, or null if the file does not exist
   * @throws Error if the file's location is not supported
   */
  async getExternalUrl(
    file: { uuid: string } | { uuid: string; locationUrl: string }
  ): Promise<URL | null> {
    let locationUrl: URL;
    let fileUuid: string;
    if ("locationUrl" in file) {
      locationUrl = new URL(file.locationUrl);
      fileUuid = file.uuid;
    } else {
      const fileRecord = await this.fileRepository.findFileByUnique(file);
      if (!fileRecord) {
        return null;
      }
      locationUrl = new URL(fileRecord.locationUrl);
      fileUuid = fileRecord.uuid;
    }
    switch (locationUrl.protocol) {
      case "file:": {
        return new URL(fileUuid, FILE_API);
      }
      case "http:":
      case "https:": {
        return locationUrl;
      }
      case "about:": {
        if (locationUrl.pathname === "blank") {
          return locationUrl;
        } else {
          throw new Error("Unsupported protocol");
        }
      }
      case "data:": {
        return locationUrl;
      }
      default: {
        throw new Error("Unsupported protocol");
      }
    }
  }

  /**
   * Get a stream for a file
   * @param file The file to get the stream for
   * @returns The stream, or null if the file does not exist or is not a supported type
   */
  async getFileStream(file: { id: number } | { uuid: string }): Promise<{
    file: File;
    stream: NodeJS.ReadableStream;
  } | null> {
    const fileRecord = await this.fileRepository.findFileByUnique(file);
    if (!fileRecord) {
      return null;
    }
    const locationUrl = new URL(fileRecord.locationUrl);
    switch (locationUrl.protocol) {
      case "file:": {
        const stream = await this.localStorage.tryStreamFile(locationUrl);
        if (stream === UnsupportedAccessMethod) {
          throw new Error("Unsupported access method");
        }
        return stream ? { file: fileRecord, stream } : null;
      }
      // I don't think we really want to deal with parsing data URLs here, but if we do, we can uncomment this
      // case "data": {
      //   // Is it base64 or ASCII url encoded?
      //   const match = /^[^/]+\/[^,;]+[^,]*?(;base64)?,([\S\s]*)$/.exec(
      //     locationUrl.pathname
      //   );
      //   if (match === null) {
      //     throw new Error("Invalid data URL");
      //   }
      //   const { 1: base64, 2: body } = match;
      //   if (body === undefined) {
      //     throw new Error("Invalid data URL");
      //   }
      //   const buffer = Buffer.from(
      //     decodeURIComponent(body),
      //     base64 ? "base64" : "utf8"
      //   );

      //   return Readable.from(buffer);
      // }
      default: {
        return null;
      }
    }
  }
}

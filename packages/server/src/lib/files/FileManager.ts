import { MIMEType } from "util";

import { Service } from "typedi";

import { applicationUrl } from "../../environment.js";
import { FileRepository } from "../../repositories/file/fileRepository.js";

import { LocalStorageProvider } from "./storage/LocalStorageProvider.js";
import type {
  StorableFile,
  StorageProvider,
} from "./storage/StorageProvider.js";

const FILE_API = new URL("/api/file/download/", applicationUrl);

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
    file: { id: number } | { uuid: string }
  ): Promise<URL | null> {
    const fileRecord = await this.fileRepository.findFileByUnique(file);
    if (!fileRecord) {
      return null;
    }
    const locationUrl = new URL(fileRecord.locationUrl);
    switch (locationUrl.protocol) {
      case "file": {
        return new URL(fileRecord.uuid, FILE_API);
      }
      case "http":
      case "https": {
        return locationUrl;
      }
      case "data": {
        return new URL(fileRecord.uuid, FILE_API);
      }
      default: {
        throw new Error("Unsupported protocol");
      }
    }
  }
}

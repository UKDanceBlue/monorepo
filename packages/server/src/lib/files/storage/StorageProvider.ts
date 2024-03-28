import type { MIMEType } from "util";

export const FileSource = {
  Stream: "stream",
  Buffer: "buffer",
} as const;
export type StorableFileType = (typeof FileSource)[keyof typeof FileSource];

export type StorableFile =
  | {
      type: typeof FileSource.Stream;
      stream: NodeJS.ReadableStream;
      name: string;
    }
  | {
      type: typeof FileSource.Buffer;
      buffer: Buffer;
      name: string;
    };

export const UnsupportedAccessMethod = Symbol("UnsupportedAccessMethod");

export interface StorageProvider {
  /**
   * The URL protocol(s) supported by the provider
   * @example ["smbs", "smb"] for SMB or ["file"] for the local file system
   */
  supportedProtocols: string[];

  /**
   * @param mimeType The MIME type to check
   * @returns Whether the provider supports the MIME type
   */
  supportsMimeType(mimeType: MIMEType | string): boolean;

  /**
   * @param file The file to store
   * @returns The URL of the stored file
   * @throws If the file could not be stored
   */
  storeFile(file: StorableFile): Promise<URL>;
  /**
   * @param url The URL of the file to delete
   * @throws If the file could not be deleted
   */
  deleteFile(url: URL): Promise<void>;
  /**
   * @param url The URL of the file to read
   * @returns A readable stream of the file if it exists, `UnsupportedAccessMethod` if the provider does not support streaming, or `null` if the file does not exist
   */
  tryStreamFile(
    url: URL
  ): Promise<NodeJS.ReadableStream | typeof UnsupportedAccessMethod | null>;
  /**
   * @param url The URL of the file to read
   * @returns A buffer of the file if it exists, or `null` if the file does not exist
   */
  readFile(url: URL): Promise<Buffer | null>;
}

export abstract class BaseStorageProvider implements Partial<StorageProvider> {
  async readFile(this: StorageProvider, url: URL): Promise<Buffer | null> {
    const stream = await this.tryStreamFile(url);
    if (stream === UnsupportedAccessMethod) {
      throw new Error(
        "This provider does not support the default readFile method"
      );
    }
    if (stream === null) {
      return null;
    }
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(chunks);
  }
  tryStreamFile(
    _url: URL
  ): Promise<NodeJS.ReadableStream | typeof UnsupportedAccessMethod | null> {
    return Promise.resolve(UnsupportedAccessMethod);
  }
}

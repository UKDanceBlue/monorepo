import { compress, decompress } from "lz-string";

export const jsonCompress = (json: unknown): string => {
  const stringified = JSON.stringify(json);

  return compress(stringified);
};

export const jsonDecompress = (json: string): unknown => {
  const decompressed = decompress(json);

  return decompressed === null ? null : JSON.parse(decompressed);
};

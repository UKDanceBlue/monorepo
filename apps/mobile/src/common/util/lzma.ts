import { compress, decompress } from "lz-string";

export const jsonCompress = (json: unknown): string => {
  const stringified = JSON.stringify(json);

  return compress(stringified);
};

export const jsonDecompress = (json: string): unknown => {
  const decompressed = decompress(json);

  if (decompressed === null) {
    return null;
  } else {
    return JSON.parse(decompressed);
  }
};

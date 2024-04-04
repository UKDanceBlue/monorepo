import assert from "node:assert";

import type { SharpOptions } from "sharp";
import sharp from "sharp";
import { rgbaToThumbHash } from "thumbhash";

/**
 * Generates a thumbhash from an image
 *
 * @param input An image buffer or a path to an image
 * @param options Sharp options to use when processing the image
 *
 * @returns A promise that resolves to the thumbhash of the image, as well as the width and height of the original image for convenience
 */
export async function generateThumbHash(
  input:
    | Buffer
    | ArrayBuffer
    | Uint8Array
    | Uint8ClampedArray
    | Int8Array
    | Uint16Array
    | Int16Array
    | Uint32Array
    | Int32Array
    | Float32Array
    | Float64Array
    | string,
  options?: SharpOptions
): Promise<{ thumbHash: Uint8Array; width: number; height: number }> {
  // Get an RGBA buffer from the image
  const baseImage = sharp(input, options);

  // Get the width and height of the image
  const { width, height } = await baseImage.metadata();
  if (!width || !height) {
    throw new Error("Could not get image metadata");
  }

  // Calculate the aspect ratio
  const aspectRatio = width / height;
  // And calculate a new width and height that will fit within a 100x100 square
  const widthToUse = aspectRatio > 1 ? 100 : Math.round(100 * aspectRatio);
  const heightToUse = aspectRatio < 1 ? 100 : Math.round(100 / aspectRatio);

  assert(widthToUse <= 100 && heightToUse <= 100);

  const rgbaBuffer = await baseImage
    .ensureAlpha()
    .raw()
    .resize({
      width: widthToUse,
      height: heightToUse,
      fit: "contain",
    })
    .toBuffer({
      resolveWithObject: false,
    });

  // Convert to an array of js numbers ([r,g,b,a,r,g,b,a,...])
  return {
    thumbHash: rgbaToThumbHash(widthToUse, heightToUse, rgbaBuffer),
    width,
    height,
  };
}

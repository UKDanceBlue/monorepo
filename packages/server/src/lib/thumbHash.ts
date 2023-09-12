import assert from "node:assert";

import type { SharpOptions } from "sharp";
import sharp from "sharp";
import { rgbaToThumbHash } from "thumbhash";

/**
 * Generates a thumbhash from an image
 *
 * @param input An image buffer or a path to an image
 * @param options Sharp options to use when processing the image
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
  options: SharpOptions
): Promise<Uint8Array> {
  // Get an RGBA buffer from the image
  const baseImage = sharp(input, options);

  // Get the width and height of the image
  const { width, height } = await baseImage.metadata();
  if (!width || !height) throw new Error("Could not get image metadata");

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
  return rgbaToThumbHash(widthToUse, heightToUse, rgbaBuffer);
}

import type { BasicError } from "@ukdanceblue/common/error";
import {
  FetchError,
  InvariantError,
  toBasicError,
} from "@ukdanceblue/common/error";
import mime from "mime";
import sharp from "sharp";
import type { Result } from "ts-results-es";
import { Err, Ok } from "ts-results-es";
import { MIMEType } from "util";

import { generateThumbHash } from "#lib/thumbHash.js";

export async function externalUrlToImage(url: URL): Promise<
  Result<
    {
      height: number;
      width: number;
      mimeType: MIMEType;
      thumbHash: Buffer;
      url: URL;
    },
    InvariantError | FetchError | BasicError
  >
> {
  try {
    const imageResp = await FetchError.safeFetch(url);
    if (imageResp.isErr()) {
      return imageResp;
    }
    const image = sharp(await imageResp.value.arrayBuffer());
    const {
      thumbHash,
      width,
      height,
      metadata: { format },
    } = await generateThumbHash({ image });

    if (!width || !height) {
      return Err(new InvariantError("Could not find dimensions of image"));
    }

    return Ok({
      height,
      width,
      mimeType: new MIMEType((format && mime.getType(format)) ?? "image/jpeg"),
      thumbHash: Buffer.from(thumbHash),
      url,
    });
  } catch (error) {
    return Err(toBasicError(error));
  }
}

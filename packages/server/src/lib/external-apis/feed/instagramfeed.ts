import { Service } from "@freshgum/typedi";
import { ImageNode, InstagramFeedNode } from "@ukdanceblue/common";
import {
  BasicError,
  ConcreteError,
  FetchError,
  InvariantError,
} from "@ukdanceblue/common/error";
import { toBasicError } from "@ukdanceblue/common/error";
import { hash } from "crypto";
import { DateTime } from "luxon";
import { AsyncResult, Result } from "ts-results-es";
import { Err, Ok } from "ts-results-es";
import { z } from "zod";

import { ZodError } from "#error/zod.js";
import { instagramApiKeyToken } from "#lib/typediTokens.js";

import { externalUrlToImage } from "../externalUrlToImage.js";

const feedSchema = z.object({
  data: z.array(
    z.object({
      media_url: z.string().url().optional(),
      caption: z.string().optional(),
      permalink: z.string().url().optional(),
      id: z.string(),
      media_type: z.enum(["CAROUSEL_ALBUM", "IMAGE", "VIDEO"]),
      timestamp: z.string().transform((iso) => DateTime.fromISO(iso)),
    })
  ),
  paging: z.object({
    cursors: z.object({
      before: z.string(),

      after: z.string(),
    }),
    next: z.string().url().optional(),
    previous: z.string().url().optional(),
  }),
});

export type InstagramFeedItem = z.TypeOf<typeof feedSchema>["data"][number];

const thirtyMinutesInMs = 1000 * 60 * 30;

@Service([instagramApiKeyToken])
export class InsagramApi {
  constructor(private readonly instagramApiKey: string) {}

  private cachedFeedResponse: InstagramFeedNode[] | undefined = undefined;
  private cacheExpiry: number | undefined = undefined;

  private instagramApiRequest<Input, Output>(
    path: string,
    fields: string[],
    zodSchema: z.ZodType<Output, z.ZodTypeDef, Input>,
    limit: number
  ): AsyncResult<Output, BasicError | ZodError> {
    const queryParams = new URLSearchParams({
      fields: fields.join(","),
      access_token: this.instagramApiKey,
      limit: limit.toFixed(0),
    });
    const url = `https://graph.instagram.com/v21.0/${path}?${queryParams.toString()}`;
    return new AsyncResult(Result.wrapAsync(() => fetch(url)))
      .map((response) => response.json())
      .map((data) => zodSchema.safeParseAsync(data))
      .mapErr(toBasicError)
      .andThen((parsedData) =>
        parsedData.error
          ? Err(new ZodError(parsedData.error))
          : Ok(parsedData.data)
      );
  }

  getFeed(
    limit: number
  ): AsyncResult<
    InstagramFeedNode[],
    readonly [ConcreteError] | readonly [ConcreteError, InstagramFeedNode[]]
  > {
    if (
      this.cachedFeedResponse &&
      this.cacheExpiry &&
      this.cacheExpiry > Date.now()
    ) {
      return Ok(this.cachedFeedResponse).toAsyncResult();
    }
    return this.instagramApiRequest(
      "me/media",
      ["media_url", "caption", "permalink", "media_type", "id", "timestamp"],
      feedSchema,
      limit * 2
    )
      .map(({ data }) =>
        Promise.all(
          data
            .filter(({ media_type }) => media_type !== "VIDEO")
            .map(instagramFeedItemToNode)
        )
      )
      .mapErr((error) =>
        this.cachedFeedResponse
          ? ([error, this.cachedFeedResponse] as const)
          : ([error] as const)
      )
      .andThen((response) => {
        const all = Result.all(response);
        if (all.isErr()) return all;
        this.cachedFeedResponse = all.value;
        this.cacheExpiry = Date.now() + thirtyMinutesInMs;
        return all;
      });
  }
}

async function instagramFeedItemToNode(
  item: InstagramFeedItem
): Promise<
  Result<InstagramFeedNode, [InvariantError | FetchError | BasicError]>
> {
  const image = await instagramMediaUrlToNode(item.media_url);

  if (image.isErr()) {
    return image.mapErr((error) => [error]);
  }

  return Ok(
    InstagramFeedNode.init({
      id: item.id,
      title: "Instagram Post",
      image: image.value,
      textContent: item.caption,
      link: item.permalink ? new URL(item.permalink) : undefined,
      createdAt: item.timestamp.toJSDate(),
      updatedAt: item.timestamp.toJSDate(),
    })
  );
}

const cachedImageNodesSize = 20;
const cachedImageNodes: [string, ImageNode][] = [];

async function instagramMediaUrlToNode(
  media_url: string | undefined
): Promise<
  Result<ImageNode | undefined, InvariantError | FetchError | BasicError>
> {
  if (!media_url) return Ok(undefined);

  const cached = cachedImageNodes.find(([url]) => url === media_url);
  if (cached) return Ok(cached[1]);

  const url = new URL(media_url);

  return new AsyncResult(externalUrlToImage(url)).map((image) => {
    const node = ImageNode.init({
      id: hash("sha1", media_url),
      ...image,
      thumbHash: image.thumbHash.toString("base64"),
      mimeType: image.mimeType.toString(),
    });
    if (cachedImageNodes.length >= cachedImageNodesSize) {
      cachedImageNodes.shift();
    }
    cachedImageNodes.push([media_url, node]);
    return node;
  }).promise;
}

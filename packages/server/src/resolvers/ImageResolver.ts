import { MIMEType } from "node:util";

import { Service } from "@freshgum/typedi";
import type { CrudResolver, GlobalId } from "@ukdanceblue/common";
import {
  AccessControlAuthorized,
  GlobalIdScalar,
  ImageNode,
} from "@ukdanceblue/common";
import {
  CreateImageInput,
  ListImagesArgs,
  ListImagesResponse,
} from "@ukdanceblue/common";
import { InvalidArgumentError, NotFoundError } from "@ukdanceblue/common/error";
import { GraphQLURL } from "graphql-scalars";
import fetch from "node-fetch";
import { Result } from "ts-results-es";
import { Arg, Args, Ctx, Mutation, Query, Resolver } from "type-graphql";

import { FileManager } from "#files/FileManager.js";
import { WithAuditLogging } from "#lib/logging/auditLogging.js";
import { generateThumbHash } from "#lib/thumbHash.js";
import { logger } from "#logging/standardLogging.js";
import { imageModelToResource } from "#repositories/image/imageModelToResource.js";
import { ImageRepository } from "#repositories/image/ImageRepository.js";
import type { AsyncRepositoryResult } from "#repositories/shared.js";

import type { GraphQLContext } from "../lib/auth/context.js";

@Resolver(() => ImageNode)
@Service([ImageRepository, FileManager])
export class ImageResolver implements CrudResolver<ImageNode, "image"> {
  constructor(
    private readonly imageRepository: ImageRepository,
    private readonly fileManager: FileManager
  ) {}

  @AccessControlAuthorized("get", ["getId", "ImageNode", "id"])
  @Query(() => ImageNode, { name: "image" })
  async image(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId,
    @Ctx() { serverUrl }: GraphQLContext
  ): Promise<ImageNode> {
    const result = await this.imageRepository.findImageByUnique({ uuid: id });

    if (result == null) {
      throw new NotFoundError("Image");
    }

    return imageModelToResource(
      result,
      result.file,
      this.fileManager,
      serverUrl
    ).promise.then((r) => r.unwrap());
  }

  @AccessControlAuthorized("list", ["every", "ImageNode"])
  @Query(() => ListImagesResponse, { name: "images" })
  images(
    @Args(() => ListImagesArgs) query: ListImagesArgs,
    @Ctx() { serverUrl }: GraphQLContext
  ): AsyncRepositoryResult<ListImagesResponse> {
    return this.imageRepository
      .findAndCount({
        filters: query.filters,
        sortBy: query.sortBy,
        offset: query.offset,
        limit: query.limit,
        search: query.search,
      })
      .andThen(async (result) => {
        return Result.all(
          await Promise.all(
            result.selectedRows.map(
              (row) =>
                imageModelToResource(row, row.file, this.fileManager, serverUrl)
                  .promise
            )
          )
        ).map((data) => ({ data, total: result.total }));
      })
      .map(({ data, total }) => {
        return ListImagesResponse.newPaginated({
          data,
          total,
        });
      });
  }

  @AccessControlAuthorized("create", ["every", "ImageNode"])
  @Mutation(() => ImageNode, { name: "createImage" })
  @WithAuditLogging()
  async createImage(
    @Arg("input") input: CreateImageInput,
    @Ctx() { serverUrl }: GraphQLContext
  ): Promise<ImageNode> {
    const { mime, thumbHash, width, height } = await this.handleImageUrl(
      input.url
    );
    const result = await this.imageRepository.createImage({
      width,
      height,
      alt: input.alt,
      file:
        input.url != null
          ? {
              create: {
                filename: input.url.pathname.split("/").pop() ?? "image",
                locationUrl: input.url.toString(),
                mimeTypeName: mime.type,
                mimeSubtypeName: mime.subtype,
                mimeParameters:
                  mime.params.keys.length > 0
                    ? {
                        set: [...mime.params.entries()].map(
                          ([k, v]) => `${k}=${v}`
                        ),
                      }
                    : undefined,
              },
            }
          : {
              create: {
                filename: "none",
                locationUrl: "about:blank",
                mimeTypeName: "application",
                mimeSubtypeName: "octet-stream",
              },
            },
      thumbHash: thumbHash != null ? Buffer.from(thumbHash) : null,
    });

    return imageModelToResource(
      result,
      null,
      this.fileManager,
      serverUrl
    ).promise.then((r) => r.unwrap());
  }

  @AccessControlAuthorized("update", ["getId", "ImageNode", "id"])
  @Mutation(() => ImageNode, { name: "setImageAltText" })
  @WithAuditLogging()
  async setImageAltText(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId,
    @Arg("alt") alt: string,
    @Ctx() { serverUrl }: GraphQLContext
  ): Promise<ImageNode> {
    const result = await this.imageRepository.updateImage(
      {
        uuid: id,
      },
      {
        alt,
      }
    );

    if (result == null) {
      throw new NotFoundError("Image");
    }

    return imageModelToResource(
      result,
      result.file,
      this.fileManager,
      serverUrl
    ).promise.then((r) => r.unwrap());
  }

  @AccessControlAuthorized("update", ["getId", "ImageNode", "id"])
  @Mutation(() => ImageNode, { name: "setImageUrl" })
  @WithAuditLogging()
  async setImageUrl(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId,
    @Arg("url", () => GraphQLURL) url: URL,
    @Ctx() { serverUrl }: GraphQLContext
  ): Promise<ImageNode> {
    const { mime, thumbHash, width, height } = await this.handleImageUrl(url);
    const result = await this.imageRepository.updateImage(
      {
        uuid: id,
      },
      {
        width,
        height,
        file: {
          create: {
            filename: url.pathname.split("/").pop() ?? "image",
            locationUrl: url.toString(),
            mimeTypeName: mime.type,
            mimeSubtypeName: mime.subtype,
            mimeParameters:
              mime.params.keys.length > 0
                ? {
                    set: [...mime.params.entries()].map(
                      ([k, v]) => `${k}=${v}`
                    ),
                  }
                : undefined,
          },
        },
        thumbHash: thumbHash != null ? Buffer.from(thumbHash) : null,
      }
    );

    if (result == null) {
      throw new NotFoundError("Image");
    }

    return imageModelToResource(
      result,
      result.file,
      this.fileManager,
      serverUrl
    ).promise.then((r) => r.unwrap());
  }

  @AccessControlAuthorized("delete", ["getId", "ImageNode", "id"])
  @Mutation(() => ImageNode, { name: "deleteImage" })
  @WithAuditLogging()
  async deleteImage(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId,
    @Ctx() { serverUrl }: GraphQLContext
  ): Promise<ImageNode> {
    const result = await this.imageRepository.deleteImage({ uuid: id });

    if (result == null) {
      throw new NotFoundError("Image");
    }

    return imageModelToResource(
      result,
      result.file,
      this.fileManager,
      serverUrl
    ).promise.then((r) => r.unwrap());
  }

  private async handleImageUrl(url: URL | null | undefined): Promise<{
    mime: MIMEType;
    thumbHash: Uint8Array | null;
    width: number;
    height: number;
  }> {
    if (url != null) {
      if (url.protocol !== "https:") {
        throw new InvalidArgumentError(
          "An Image URL must be a valid HTTPS URL"
        );
      } else {
        let image: Buffer;
        try {
          const download = await fetch(url);
          const buffer = await download.arrayBuffer();
          image = Buffer.from(buffer);

          const contentType = download.headers.get("content-type");
          if (contentType == null) {
            throw new InvalidArgumentError(
              "The requested image does not have a content type"
            );
          }
          let mime;
          try {
            mime = new MIMEType(contentType);
          } catch (error) {
            logger.error("Failed to parse MIME type in createImage", {
              error,
            });
            throw new InvalidArgumentError(
              "Could not determine the MIME type of the requested image"
            );
          }
          const { thumbHash, width, height } = await generateThumbHash({
            data: image,
          });
          return { mime, thumbHash, width, height };
        } catch (error) {
          logger.error("Failed to fetch an image from url in createImage", {
            error,
          });
          throw new InvalidArgumentError(
            "Could not access the requested image"
          );
        }
      }
    }
    return {
      mime: new MIMEType("application/octet-stream"),
      thumbHash: null,
      width: 0,
      height: 0,
    };
  }
}

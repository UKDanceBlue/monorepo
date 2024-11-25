import { MIMEType } from "node:util";

import { Service } from "@freshgum/typedi";
import type { GlobalId } from "@ukdanceblue/common";
import {
  AccessLevel,
  GlobalIdScalar,
  ImageNode,
  LegacyError,
  LegacyErrorCode,
  AccessControlAuthorized,
  SortDirection,
} from "@ukdanceblue/common";
import {
  CreateImageInput,
  DeleteImageResponse,
  GetImageByUuidResponse,
  ListImagesArgs,
  ListImagesResponse,
} from "@ukdanceblue/common";
import { URLResolver } from "graphql-scalars";
import fetch from "node-fetch";
import { Arg, Args, Ctx, Mutation, Query, Resolver } from "type-graphql";

import { FileManager } from "#files/FileManager.js";
import { generateThumbHash } from "#lib/thumbHash.js";
import { auditLogger } from "#logging/auditLogging.js";
import { logger } from "#logging/standardLogging.js";
import { imageModelToResource } from "#repositories/image/imageModelToResource.js";
import { ImageRepository } from "#repositories/image/ImageRepository.js";

import type { GraphQLContext } from "./context.js";

@Resolver(() => ImageNode)
@Service([ImageRepository, FileManager])
export class ImageResolver {
  constructor(
    private readonly imageRepository: ImageRepository,
    private readonly fileManager: FileManager
  ) {}

  @Query(() => GetImageByUuidResponse, { name: "image" })
  async getByUuid(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId,
    @Ctx() { serverUrl }: GraphQLContext
  ): Promise<GetImageByUuidResponse> {
    const result = await this.imageRepository.findImageByUnique({ uuid: id });

    if (result == null) {
      throw new LegacyError(LegacyErrorCode.NotFound, "Image not found");
    }

    return GetImageByUuidResponse.newOk(
      await imageModelToResource(
        result,
        result.file,
        this.fileManager,
        serverUrl
      )
    );
  }

  @AccessControlAuthorized({
    accessLevel: AccessLevel.Committee,
  })
  @Query(() => ListImagesResponse, { name: "images" })
  async list(
    @Args(() => ListImagesArgs) args: ListImagesArgs,
    @Ctx() { serverUrl }: GraphQLContext
  ): Promise<ListImagesResponse> {
    const result = await this.imageRepository.listImages({
      filters: args.filters,
      order:
        args.sortBy?.map((key, i) => [
          key,
          args.sortDirection?.[i] ?? SortDirection.desc,
        ]) ?? [],
      skip:
        args.page != null && args.actualPageSize != null
          ? (args.page - 1) * args.actualPageSize
          : null,
      take: args.actualPageSize,
    });
    const count = await this.imageRepository.countImages({
      filters: args.filters,
    });

    return ListImagesResponse.newPaginated({
      data: await Promise.all(
        result.map((model) =>
          imageModelToResource(model, model.file, this.fileManager, serverUrl)
        )
      ),
      total: count,
      page: args.page,
      pageSize: args.actualPageSize,
    });
  }

  @AccessControlAuthorized({
    accessLevel: AccessLevel.CommitteeChairOrCoordinator,
  })
  @Mutation(() => ImageNode, { name: "createImage" })
  async create(
    @Arg("input") input: CreateImageInput,
    @Ctx() { serverUrl }: GraphQLContext
  ): Promise<ImageNode> {
    const { mime, thumbHash, width, height } = await handleImageUrl(input.url);
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

    return imageModelToResource(result, null, this.fileManager, serverUrl);
  }

  @AccessControlAuthorized({
    accessLevel: AccessLevel.CommitteeChairOrCoordinator,
  })
  @Mutation(() => ImageNode, { name: "setImageAltText" })
  async setAltText(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId,
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
      throw new LegacyError(LegacyErrorCode.NotFound, "Image not found");
    }

    auditLogger.secure("Image alt text set", { image: result });

    return imageModelToResource(
      result,
      result.file,
      this.fileManager,
      serverUrl
    );
  }

  @AccessControlAuthorized({
    accessLevel: AccessLevel.CommitteeChairOrCoordinator,
  })
  @Mutation(() => ImageNode, { name: "setImageUrl" })
  async setImageUrl(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId,
    @Arg("url", () => URLResolver) url: URL,
    @Ctx() { serverUrl }: GraphQLContext
  ): Promise<ImageNode> {
    const { mime, thumbHash, width, height } = await handleImageUrl(url);
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
      throw new LegacyError(LegacyErrorCode.NotFound, "Image not found");
    }

    auditLogger.secure("Image URL set", { image: result });

    return imageModelToResource(
      result,
      result.file,
      this.fileManager,
      serverUrl
    );
  }

  @AccessControlAuthorized({
    accessLevel: AccessLevel.CommitteeChairOrCoordinator,
  })
  @Mutation(() => DeleteImageResponse, { name: "deleteImage" })
  async delete(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<DeleteImageResponse> {
    const result = await this.imageRepository.deleteImage({ uuid: id });

    if (result == null) {
      throw new LegacyError(LegacyErrorCode.NotFound, "Image not found");
    }

    auditLogger.secure("Image deleted", { image: result });

    return DeleteImageResponse.newOk(true);
  }
}

async function handleImageUrl(url: URL | null | undefined): Promise<{
  mime: MIMEType;
  thumbHash: Uint8Array | null;
  width: number;
  height: number;
}> {
  if (url != null) {
    if (url.protocol !== "https:") {
      throw new LegacyError(
        LegacyErrorCode.InvalidRequest,
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
          throw new LegacyError(
            LegacyErrorCode.InvalidRequest,
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
          throw new LegacyError(
            LegacyErrorCode.InvalidRequest,
            "Could not determine the MIME type of the requested image"
          );
        }
        const { thumbHash, width, height } = await generateThumbHash(image);
        return { mime, thumbHash, width, height };
      } catch (error) {
        logger.error("Failed to fetch an image from url in createImage", {
          error,
        });
        throw new LegacyError(
          LegacyErrorCode.InvalidRequest,
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

import { MIMEType } from "node:util";

import {
  AccessControl,
  AccessLevel,
  DetailedError,
  ErrorCode,
  FilteredListQueryArgs,
  ImageResource,
} from "@ukdanceblue/common";
import { NonNegativeIntResolver, URLResolver } from "graphql-scalars";
import {
  Arg,
  Args,
  ArgsType,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { Service } from "typedi";

import { FileManager } from "../lib/files/FileManager.js";
import { auditLogger } from "../lib/logging/auditLogging.js";
import { logger } from "../lib/logging/standardLogging.js";
import { generateThumbHash } from "../lib/thumbHash.js";
import { ImageRepository } from "../repositories/image/ImageRepository.js";
import { imageModelToResource } from "../repositories/image/imageModelToResource.js";

import {
  AbstractGraphQLCreatedResponse,
  AbstractGraphQLOkResponse,
  AbstractGraphQLPaginatedResponse,
} from "./ApiResponse.js";

@ObjectType("GetImageByUuidResponse", { implements: AbstractGraphQLOkResponse })
class GetImageByUuidResponse extends AbstractGraphQLOkResponse<ImageResource> {
  @Field(() => ImageResource)
  data!: ImageResource;
}
@ObjectType("CreateImageResponse", {
  implements: AbstractGraphQLCreatedResponse<ImageResource>,
})
class CreateImageResponse extends AbstractGraphQLCreatedResponse<ImageResource> {
  @Field(() => ImageResource)
  data!: ImageResource;
}
@ObjectType("DeleteImageResponse", {
  implements: AbstractGraphQLOkResponse<boolean>,
})
class DeleteImageResponse extends AbstractGraphQLOkResponse<never> {}
@InputType()
class CreateImageInput implements Partial<ImageResource> {
  @Field(() => NonNegativeIntResolver)
  width!: number;
  @Field(() => NonNegativeIntResolver)
  height!: number;

  @Field(() => String, { nullable: true })
  alt?: string | null;

  @Field(() => URLResolver, { nullable: true })
  url?: URL | null;
}

@ArgsType()
class ListImagesArgs extends FilteredListQueryArgs<
  "alt" | "width" | "height" | "createdAt" | "updatedAt",
  "alt",
  never,
  "width" | "height",
  "createdAt" | "updatedAt",
  never
>("ImageResolver", {
  all: ["alt", "width", "height", "createdAt", "updatedAt"],
  string: ["alt"],
  numeric: ["width", "height"],
  date: ["createdAt", "updatedAt"],
}) {}

@ObjectType("ListImagesResponse", {
  implements: AbstractGraphQLPaginatedResponse<ImageResource[]>,
})
class ListImagesResponse extends AbstractGraphQLPaginatedResponse<ImageResource> {
  @Field(() => [ImageResource])
  data!: ImageResource[];
}

@Resolver(() => ImageResource)
@Service()
export class ImageResolver {
  constructor(
    private readonly imageRepository: ImageRepository,
    private readonly fileManager: FileManager
  ) {}

  @Query(() => GetImageByUuidResponse, { name: "image" })
  async getByUuid(@Arg("uuid") uuid: string): Promise<GetImageByUuidResponse> {
    const result = await this.imageRepository.findImageByUnique({ uuid });

    if (result == null) {
      throw new DetailedError(ErrorCode.NotFound, "Image not found");
    }

    return GetImageByUuidResponse.newOk(
      await imageModelToResource(result, result.file, this.fileManager)
    );
  }

  @Query(() => ListImagesResponse, { name: "images" })
  async list(
    @Args(() => ListImagesArgs) args: ListImagesArgs
  ): Promise<ListImagesResponse> {
    const result = await this.imageRepository.listImages(args);
    const count = await this.imageRepository.countImages(args);

    return ListImagesResponse.newPaginated({
      data: await Promise.all(
        result.map((model) =>
          imageModelToResource(model, model.file, this.fileManager)
        )
      ),
      total: count,
      page: args.page,
      pageSize: args.pageSize,
    });
  }

  @AccessControl({ accessLevel: AccessLevel.CommitteeChairOrCoordinator })
  @Mutation(() => CreateImageResponse, { name: "createImage" })
  async create(
    @Arg("input") input: CreateImageInput
  ): Promise<CreateImageResponse> {
    const { mime, thumbHash } = await handleImageUrl(input.url);
    const result = await this.imageRepository.createImage({
      width: input.width,
      height: input.height,
      alt: input.alt,
      file:
        input.url != null
          ? {
              create: {
                filename: input.url.pathname.split("/").pop() ?? "image",
                locationUrl: input.url.toString(),
                mimeTypeName: mime?.type ?? "image",
                mimeSubtypeName: mime?.subtype ?? "jpeg",
                mimeParameters: mime
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

    return CreateImageResponse.newCreated(
      await imageModelToResource(result, null, this.fileManager),
      result.uuid
    );
  }

  @AccessControl({ accessLevel: AccessLevel.CommitteeChairOrCoordinator })
  @Mutation(() => DeleteImageResponse, { name: "deleteImage" })
  async delete(@Arg("uuid") uuid: string): Promise<DeleteImageResponse> {
    const result = await this.imageRepository.deleteImage({ uuid });

    if (result == null) {
      throw new DetailedError(ErrorCode.NotFound, "Image not found");
    }

    auditLogger.normal("Image deleted", { image: result });

    return DeleteImageResponse.newOk(true);
  }
}

async function handleImageUrl(url: URL): Promise<{
  mime: MIMEType;
  thumbHash: Uint8Array;
}>;
async function handleImageUrl(url: null | undefined): Promise<{
  mime: null;
  thumbHash: null;
}>;
async function handleImageUrl(url: URL | null | undefined): Promise<{
  mime: MIMEType | null;
  thumbHash: Uint8Array | null;
}>;
async function handleImageUrl(url: URL | null | undefined): Promise<{
  mime: MIMEType | null;
  thumbHash: Uint8Array | null;
}> {
  if (url != null) {
    if (url.protocol !== "https:") {
      throw new DetailedError(
        ErrorCode.InvalidRequest,
        "An Image URL must be a valid HTTPS URL"
      );
    } else {
      let image: Buffer;
      try {
        const download = await fetch(url, {
          mode: "no-cors",
          credentials: "omit",
        });
        const buffer = await download.arrayBuffer();
        image = Buffer.from(buffer);

        const contentType = download.headers.get("content-type");
        if (contentType == null) {
          throw new DetailedError(
            ErrorCode.InvalidRequest,
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
          throw new DetailedError(
            ErrorCode.InvalidRequest,
            "Could not determine the MIME type of the requested image"
          );
        }
        return { mime, thumbHash: await generateThumbHash(image) };
      } catch (error) {
        logger.error("Failed to fetch an image from url in createImage", {
          error,
        });
        throw new DetailedError(
          ErrorCode.InvalidRequest,
          "Could not access the requested image"
        );
      }
    }
  }
  return { mime: null, thumbHash: null };
}

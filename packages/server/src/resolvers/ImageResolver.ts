import {
  AccessControl,
  AccessLevel,
  DetailedError,
  ErrorCode,
  FilteredListQueryArgs,
  ImageResource,
} from "@ukdanceblue/common";
import { NonNegativeIntResolver } from "graphql-scalars";
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

  @Field(() => String, { nullable: true })
  thumbHash?: string | null;
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

  @Query(() => [ImageResource], { name: "images" })
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
    const result = await this.imageRepository.createImage({
      width: input.width,
      height: input.height,
      alt: input.alt,
      thumbHash: input.thumbHash
        ? Buffer.from(input.thumbHash, "base64")
        : null,
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

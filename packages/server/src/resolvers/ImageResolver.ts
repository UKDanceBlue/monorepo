import {
  AccessControl,
  AccessLevel,
  DetailedError,
  ErrorCode,
  ImageResource,
} from "@ukdanceblue/common";
import { NonNegativeIntResolver } from "graphql-scalars";
import {
  Arg,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { Service } from "typedi";

import { auditLogger } from "../lib/logging/auditLogging.js";
import { ImageRepository } from "../repositories/image/ImageRepository.js";
import { imageModelToResource } from "../repositories/image/imageModelToResource.js";

import {
  AbstractGraphQLCreatedResponse,
  AbstractGraphQLOkResponse,
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

  @Field(() => String)
  mimeType!: string;

  @Field(() => String, { nullable: true })
  alt?: string | null;

  @Field(() => String, { nullable: true })
  imageData?: string | null;
  @Field(() => String, { nullable: true })
  url?: URL | null;

  @Field(() => String, { nullable: true })
  thumbHash?: string | null;
}

@Resolver(() => ImageResource)
@Service()
export class ImageResolver {
  constructor(private readonly imageRepository: ImageRepository) {}

  @Query(() => GetImageByUuidResponse, { name: "image" })
  async getByUuid(@Arg("uuid") uuid: string): Promise<GetImageByUuidResponse> {
    const result = await this.imageRepository.findImageByUnique({ uuid });

    if (result == null) {
      throw new DetailedError(ErrorCode.NotFound, "Image not found");
    }

    return GetImageByUuidResponse.newOk(imageModelToResource(result));
  }

  @AccessControl({ accessLevel: AccessLevel.CommitteeChairOrCoordinator })
  @Mutation(() => CreateImageResponse, { name: "createImage" })
  async create(
    @Arg("input") input: CreateImageInput
  ): Promise<CreateImageResponse> {
    if (input.imageData == null && input.url == null) {
      throw new DetailedError(
        ErrorCode.MissingRequiredInput,
        "Must provide either imageData or url"
      );
    }

    const result = await this.imageRepository.createImage({
      url: input.url?.href,
      imageData: input.imageData
        ? Buffer.from(input.imageData, "base64")
        : null,
      width: input.width,
      height: input.height,
      alt: input.alt,
      thumbHash: input.thumbHash
        ? Buffer.from(input.thumbHash, "base64")
        : null,
      mimeType: input.mimeType,
    });

    return CreateImageResponse.newCreated(
      imageModelToResource(result),
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

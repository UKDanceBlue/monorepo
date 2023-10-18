import { ErrorCode, ImageResource } from "@ukdanceblue/common";
import { NonNegativeIntMock } from "graphql-scalars";
import {
  Arg,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";

import { ImageModel } from "../models/Image.js";

import {
  AbstractGraphQLCreatedResponse,
  AbstractGraphQLOkResponse,
  DetailedError,
} from "./ApiResponse.js";
import type { ResolverInterface } from "./ResolverInterface.js";

@ObjectType("GetImageByUuidResponse", { implements: AbstractGraphQLOkResponse })
class GetImageByUuidResponse extends AbstractGraphQLOkResponse<ImageResource> {
  @Field(() => ImageResource)
  data!: ImageResource;
}
@ObjectType("GetThumbHashByUuidResponse", {
  implements: AbstractGraphQLOkResponse<string>,
})
class GetThumbHashByUuidResponse extends AbstractGraphQLOkResponse<string> {
  @Field(() => String)
  data!: string;
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
class DeleteImageResponse extends AbstractGraphQLOkResponse<boolean> {
  @Field(() => Boolean)
  data!: boolean;
}
@InputType()
class CreateImageInput implements Partial<ImageResource> {
  @Field(() => NonNegativeIntMock)
  width!: number;
  @Field(() => NonNegativeIntMock)
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
export class ImageResolver implements ResolverInterface<ImageResource> {
  @Query(() => GetImageByUuidResponse, { name: "image" })
  async getByUuid(@Arg("uuid") uuid: string): Promise<GetImageByUuidResponse> {
    const row = await ImageModel.findOne({ where: { uuid } });

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "Image not found");
    }

    return GetImageByUuidResponse.newOk(row.toResource());
  }

  @Query(() => GetThumbHashByUuidResponse, {
    name: "thumbhash",
    nullable: true,
  })
  async getThumbHashByUuid(
    @Arg("uuid") uuid: string
  ): Promise<GetThumbHashByUuidResponse> {
    const result = await ImageModel.findOne({
      where: { uuid },
      attributes: ["thumbHash"],
    });

    if (result == null) {
      throw new DetailedError(ErrorCode.NotFound, "Image not found");
    }

    return GetThumbHashByUuidResponse.newOk(
      result.thumbHash?.toString("base64")
    );
  }

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

    const result = await ImageModel.create({
      width: input.width,
      height: input.height,
      mimeType: input.mimeType,
      alt: input.alt ?? null,
      imageData: input.imageData
        ? Buffer.from(input.imageData, "base64")
        : null,
      url: input.url ?? null,
      thumbHash: input.thumbHash
        ? Buffer.from(input.thumbHash, "base64")
        : null,
    });

    if (!("uuid" in result)) {
      // return GraphQLErrorResponse.from(result);
      throw new DetailedError(
        ErrorCode.InternalFailure,
        "UUID not found on created image"
      );
    }

    const response = CreateImageResponse.newOk(result.toResource());
    response.uuid = result.uuid;
    return response;
  }

  @Mutation(() => DeleteImageResponse, { name: "deleteImage" })
  async delete(@Arg("id") id: string): Promise<DeleteImageResponse> {
    const row = await ImageModel.findOne({
      where: { uuid: id },
      attributes: ["id"],
    });

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "Image not found");
    }

    await row.destroy();

    return DeleteImageResponse.newOk(true);
  }
}

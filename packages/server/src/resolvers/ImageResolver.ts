import { ErrorCode, ImageResource } from "@ukdanceblue/common";
import { Arg, Field, InputType, Mutation, Query, Resolver } from "type-graphql";

import { ImageIntermediate, ImageModel } from "../models/Image.js";

import { GraphQLErrorResponse, defineGraphQlCreatedResponse, defineGraphQlOkResponse, withGraphQLErrorUnion } from "./ApiResponse.js";
import type { ResolverInterface } from "./ResolverInterface.js";

const GetImageByUuidResponse = defineGraphQlOkResponse("GetImageByUuidResponse", ImageResource);
const GetThumbHashByUuidResponse = defineGraphQlOkResponse("GetThumbHashByUuidResponse", String);
const CreateImageResponse = defineGraphQlCreatedResponse("CreateImageResponse", ImageResource);
const DeleteImageResponse = defineGraphQlOkResponse("DeleteImageResponse", Boolean);

@InputType()
class CreateImageInput implements Partial<ImageResource> {
  @Field(() => Number)
  width!: number;
  @Field(() => Number)
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

const GetByUuidResponseUnion = withGraphQLErrorUnion(GetImageByUuidResponse, "GetImageByUuidResponse");
const GetThumbHashByUuidResponseUnion = withGraphQLErrorUnion(GetThumbHashByUuidResponse, "GetThumbHashByUuidResponse");
const CreateImageResponseUnion = withGraphQLErrorUnion(CreateImageResponse, "CreateImageResponse");
const DeleteImageResponseUnion = withGraphQLErrorUnion(DeleteImageResponse, "DeleteImageResponse");

@Resolver(() => ImageResource)
export class ImageResolver implements ResolverInterface<ImageResource> {
  @Query(() => GetByUuidResponseUnion, { name: "getImageByUuid" })
  async getByUuid(@Arg("uuid") uuid: string): Promise<typeof GetByUuidResponseUnion> {
    const row = await ImageModel.findOne({ where: { uuid } });

    if (row == null) {
      return GraphQLErrorResponse.from("Image not found", ErrorCode.NotFound);
    }

    return GetImageByUuidResponse.newOk(new ImageIntermediate(row).toResource());
  }

  @Query(() => GetThumbHashByUuidResponseUnion, { name: "getThumbHashByUuid", nullable: true })
  async getThumbHashByUuid(@Arg("uuid") uuid: string): Promise<typeof GetThumbHashByUuidResponseUnion> {
    const result = await ImageModel.findOne({ where: { uuid }, attributes: ["thumbHash"] });

    if (result == null) {
      return GraphQLErrorResponse.from("Image not found", ErrorCode.NotFound);
    }

    return GetThumbHashByUuidResponse.newOk(result.thumbHash?.toString("base64"));
  }

  @Mutation(() => CreateImageResponseUnion, { name: "createImage" })
  async create(@Arg("input") input: CreateImageInput): Promise<typeof CreateImageResponseUnion> {
    if (input.imageData == null && input.url == null) {
      return GraphQLErrorResponse.from("Must provide either imageData or url", ErrorCode.MissingRequiredInput);
    }

    const result = await ImageModel.create({
      width: input.width,
      height: input.height,
      mimeType: input.mimeType,
      alt: input.alt ?? null,
      imageData: input.imageData ? Buffer.from(input.imageData, "base64") : null,
      url: input.url ?? null,
      thumbHash: input.thumbHash ? Buffer.from(input.thumbHash, "base64") : null,
    });

    if (!("uuid" in result)) {
      return GraphQLErrorResponse.from(result);
    }

    const response = CreateImageResponse.newOk(result);
    response.uuid = result.uuid;
    return response;
  }

  @Mutation(() => DeleteImageResponseUnion, { name: "deleteImage" })
  async delete(@Arg("id") id: string): Promise<typeof DeleteImageResponseUnion> {
    const row = await ImageModel.findOne({ where: { uuid: id }, attributes: ["id"] });

    if (row == null) {
      return GraphQLErrorResponse.from("Image not found", ErrorCode.NotFound);
    }

    await row.destroy();

    return DeleteImageResponse.newOk(true);
  }
}

import { Arg, Field, InputType, Mutation, Query, Resolver } from "type-graphql";

import type { AbstractGraphQLArrayOkResponse } from "@ukdanceblue/common";
import { GraphQLErrorResponse, defineGraphQlCreatedResponse, defineGraphQlOkResponse, withGraphQLErrorUnion } from "@ukdanceblue/common";
import { ImageResource } from "@ukdanceblue/common/lib/api/graphql/object-types/Image.js";
import type { ImageServiceInterface } from "../service-declarations/ImageServiceInterface.js";
import { imageServiceToken } from "../service-declarations/ImageServiceInterface.js";

import { createBaseResolver } from "./BaseResolver.js";

const ImageResourceBaseResolver = createBaseResolver<ImageResource, ImageServiceInterface>("Image", ImageResource, imageServiceToken);

const CreateImageResponse = defineGraphQlCreatedResponse("CreateImageResponse", ImageResource);
const SetImageResponse = defineGraphQlOkResponse("SetImageResponse", ImageResource);
const GetThumbHashByUuidResponse = defineGraphQlOkResponse("GetThumbHashByUuidResponse", String);

@InputType()
class CreateImageInput implements Partial<ImageResource> {
  @Field()
  fileName!: string;

  @Field()
  mimeType!: string;
}

@InputType()
class SetImageInput implements Partial<ImageResource> {
  @Field()
  fileName?: string;

  @Field()
  mimeType?: string;
}

const GetThumbHashByUuidResponseUnion = withGraphQLErrorUnion(GetThumbHashByUuidResponse, "GetThumbHashByUuidResponse");
const CreateImageResponseUnion = withGraphQLErrorUnion(CreateImageResponse, "CreateImageResponse");
const SetImageResponseUnion = withGraphQLErrorUnion(SetImageResponse, "SetImageResponse");

@Resolver(() => ImageResource)
export class ImageResolver extends ImageResourceBaseResolver {
  @Query(() => GetThumbHashByUuidResponseUnion, { name: "getThumbHashByUuid", nullable: true })
  async getThumbHashByUuid(@Arg("uuid") uuid: string): Promise<typeof GetThumbHashByUuidResponseUnion> {
    const result = await this.service.getThumbHashByUUid(uuid);
    return GetThumbHashByUuidResponse.newOk(result);
  }

  @Mutation(() => CreateImageResponseUnion, { name: "createImage" })
  async create(@Arg("input") input: CreateImageInput): Promise<typeof CreateImageResponseUnion> {
    const result = await this.service.create(input);
    if (!("uuid" in result)) {
      return GraphQLErrorResponse.from(result);
    }

    const response = CreateImageResponse.newOk(result);
    response.uuid = result.uuid;
    return response;
  }

  @Mutation(() => SetImageResponseUnion, { name: "setImage" })
  async set(@Arg("id") id: string, @Arg("input") input: SetImageInput): Promise<typeof SetImageResponseUnion> {
    const result = await this.service.set(id, input);
    if (result instanceof Error) {
      return GraphQLErrorResponse.from(result);
    }
    return SetImageResponse.newOk(result);
  }
}
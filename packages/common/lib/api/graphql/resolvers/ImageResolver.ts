import { Arg, Field, InputType, Mutation, Query, Resolver } from "type-graphql";

import type { AbstractGraphQLArrayOkResponse } from "../object-types/ApiResponse.js";
import { GraphQLErrorResponse, defineGraphQlCreatedResponse, defineGraphQlOkResponse, withGraphQLErrorUnion } from "../object-types/ApiResponse.js";
import { ImageResource } from "../object-types/Image.js";
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

@Resolver(() => ImageResource)
export class ImageResolver extends ImageResourceBaseResolver {
  @Query(() => withGraphQLErrorUnion(GetThumbHashByUuidResponse), { name: "getThumbHashByUuid", nullable: true })
  async getThumbHashByUuid(@Arg("uuid") uuid: string): Promise<AbstractGraphQLArrayOkResponse<string> | GraphQLErrorResponse | null> {
    const result = await this.service.getThumbHashByUUid(uuid);
    if (!result) {
      return null;
    }
    return GetThumbHashByUuidResponse.newOk(result);
  }

  @Mutation(() => withGraphQLErrorUnion(CreateImageResponse), { name: "createImage" })
  async create(@Arg("input") input: CreateImageInput): Promise<AbstractGraphQLArrayOkResponse<ImageResource> | GraphQLErrorResponse> {
    const result = await this.service.create(input);
    if (!("uuid" in result)) {
      return GraphQLErrorResponse.from(result);
    }

    const response = CreateImageResponse.newOk(result);
    response.uuid = result.uuid;
    return response;
  }

  @Mutation(() => withGraphQLErrorUnion(SetImageResponse), { name: "setImage" })
  async set(@Arg("id") id: string, @Arg("input") input: SetImageInput): Promise<AbstractGraphQLArrayOkResponse<ImageResource> | GraphQLErrorResponse> {
    const result = await this.service.set(id, input);
    if (result instanceof Error) {
      return GraphQLErrorResponse.from(result);
    }
    return SetImageResponse.newOk(result);
  }
}
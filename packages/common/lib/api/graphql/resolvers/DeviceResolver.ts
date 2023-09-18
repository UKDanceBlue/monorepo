import { Arg, Field, InputType, Mutation, Resolver } from "type-graphql";

import { defineGraphQlCreatedResponse, defineGraphQlOkResponse, withGraphQLErrorUnion } from "../object-types/ApiResponse.js";
import { DeviceResource } from "../object-types/Device.js";
import type { DeviceServiceInterface } from "../service-declarations/DeviceServiceInterface.js";
import { deviceServiceToken } from "../service-declarations/DeviceServiceInterface.js";

import { createBaseResolver } from "./BaseResolver.js";
import { resolverCreateHelper, resolverSetHelper } from "./helpers.js";

const BaseResolver = createBaseResolver<DeviceResource, DeviceServiceInterface>("Device", DeviceResource, deviceServiceToken);

const CreateDeviceResponse = defineGraphQlCreatedResponse("CreateDeviceResponse", DeviceResource);
const SetDeviceResponse = defineGraphQlOkResponse("SetDeviceResponse", DeviceResource);

@InputType()
class CreateDeviceInput {
  @Field()
  public expoPushToken!: string;
}

@InputType()
class UpdateDeviceInput {
  @Field()
  public expoPushToken!: string;
}

const CreateDeviceResponseUnion = withGraphQLErrorUnion(CreateDeviceResponse, "CreateDeviceResponse");
const SetDeviceResponseUnion = withGraphQLErrorUnion(SetDeviceResponse, "SetDeviceResponse");

@Resolver()
export class DeviceResolver extends BaseResolver {
  @Mutation(() => CreateDeviceResponseUnion)
  public async createDevice(@Arg("input") input: CreateDeviceInput): Promise<typeof CreateDeviceResponseUnion> {
    const result = await this.service.create(input);
    return resolverCreateHelper(CreateDeviceResponse, result);
  }

  @Mutation(() => SetDeviceResponseUnion)
  public async setDevice(@Arg("id") id: string, @Arg("input") input: UpdateDeviceInput): Promise<typeof SetDeviceResponseUnion> {
    const result = await this.service.set(id, input);
    return resolverSetHelper(SetDeviceResponse, result);
  }
}

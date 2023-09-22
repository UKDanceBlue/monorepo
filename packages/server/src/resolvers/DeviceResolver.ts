import { DeviceResource, ErrorCode } from "@ukdanceblue/common";
import type { ResolverInterface } from "type-graphql";
import { Arg, Field, InputType, Mutation, Query, Resolver } from "type-graphql";

import { DeviceModel } from "../models/Device.js";

import { GraphQLErrorResponse, defineGraphQlCreatedResponse, defineGraphQlOkResponse, withGraphQLErrorUnion } from "./ApiResponse.js";

const GetDeviceByUuidResponse = defineGraphQlOkResponse("GetDeviceByUuidResponse", DeviceResource);
const CreateDeviceResponse = defineGraphQlCreatedResponse("CreateDeviceResponse", DeviceResource);
const DeleteDeviceResponse = defineGraphQlOkResponse("DeleteDeviceResponse", Boolean);

@InputType()
class CreateDeviceInput implements Partial<DeviceResource> {
  @Field()
  key!: string;
}

const GetByUuidResponseUnion = withGraphQLErrorUnion(GetDeviceByUuidResponse, "GetDeviceByUuidResponse");
const CreateResponseUnion = withGraphQLErrorUnion(CreateDeviceResponse, "CreateDeviceResponse");
const DeleteResponseUnion = withGraphQLErrorUnion(DeleteDeviceResponse, "DeleteDeviceResponse");

@Resolver(() => DeviceResource)
export class DeviceResolver implements ResolverInterface<DeviceResource> {
  @Query(() => DeviceResource, { name: "getDeviceByUuid" })
  async getByUuid(@Arg("uuid") uuid: string): Promise<typeof GetByUuidResponseUnion> {
    const row = await DeviceModel.findOne({ where: { uuid } });

    if (row == null) {
      return GraphQLErrorResponse.from("Device not found", ErrorCode.NotFound);
    }

    return new DeviceResource(row);
  }
}
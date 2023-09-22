import { DeviceResource, ErrorCode } from "@ukdanceblue/common";
import { Arg, Field, InputType, Mutation, Query, Resolver } from "type-graphql";

import { DeviceIntermediate, DeviceModel } from "../models/Device.js";

import { GraphQLErrorResponse, defineGraphQlCreatedResponse, defineGraphQlOkResponse, withGraphQLErrorUnion } from "./ApiResponse.js";
import type { ResolverInterface } from "./ResolverInterface.js";


const GetDeviceByUuidResponse = defineGraphQlOkResponse("GetDeviceByUuidResponse", DeviceResource);
const CreateDeviceResponse = defineGraphQlCreatedResponse("CreateDeviceResponse", DeviceResource);
const DeleteDeviceResponse = defineGraphQlOkResponse("DeleteDeviceResponse", Boolean);

@InputType()
class CreateDeviceInput implements Partial<DeviceResource> {
  @Field()
  deviceId!: string;
}

const GetByUuidResponseUnion = withGraphQLErrorUnion(GetDeviceByUuidResponse, "GetDeviceByUuidResponse");
const CreateResponseUnion = withGraphQLErrorUnion(CreateDeviceResponse, "CreateDeviceResponse");
const DeleteResponseUnion = withGraphQLErrorUnion(DeleteDeviceResponse, "DeleteDeviceResponse");

@Resolver(() => DeviceResource)
export class DeviceResolver implements ResolverInterface<DeviceResource> {
  @Query(() => GetByUuidResponseUnion, { name: "getDeviceByUuid" })
  async getByUuid(@Arg("uuid") uuid: string): Promise<typeof GetByUuidResponseUnion> {
    const row = await DeviceModel.findOne({ where: { uuid } });

    if (row == null) {
      return GraphQLErrorResponse.from("Device not found", ErrorCode.NotFound);
    }

    return GetDeviceByUuidResponse.newOk(new DeviceIntermediate(row).toResource());
  }

  @Mutation(() => CreateResponseUnion, { name: "createDevice" })
  async create(@Arg("input") input: CreateDeviceInput): Promise<typeof CreateResponseUnion> {
    const row = await DeviceModel.create(input);

    return CreateDeviceResponse.newOk(new DeviceIntermediate(row).toResource());
  }

  @Mutation(() => DeleteResponseUnion, { name: "deleteDevice" })
  async delete(@Arg("id") id: string): Promise<typeof DeleteResponseUnion> {
    const row = await DeviceModel.findOne({ where: { uuid: id }, attributes: ["id"] });

    if (row == null) {
      return GraphQLErrorResponse.from("Device not found", ErrorCode.NotFound);
    }

    await row.destroy();

    return DeleteDeviceResponse.newOk(true);
  }
}

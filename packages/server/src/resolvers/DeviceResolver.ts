import { DeviceResource, ErrorCode } from "@ukdanceblue/common";
import { Arg, Field, InputType, Mutation, Query, Resolver } from "type-graphql";

import { DeviceIntermediate, DeviceModel } from "../models/Device.js";
import { PersonModel } from "../models/Person.js";

import { GraphQLErrorResponse, defineGraphQlCreatedResponse, defineGraphQlOkResponse, defineGraphQlPaginatedResponse, withGraphQLErrorUnion } from "./ApiResponse.js";
import { DateFilterItem, StringFilterItem, UnfilteredListQueryArgs } from "./ListQueryArgs.js";
import type { ResolverInterface } from "./ResolverInterface.js";

const GetDeviceByUuidResponse = defineGraphQlOkResponse("GetDeviceByUuidResponse", DeviceResource);
const ListDevicesResponse = defineGraphQlPaginatedResponse("ListDevicesResponse", DeviceResource);
const CreateDeviceResponse = defineGraphQlCreatedResponse("CreateDeviceResponse", DeviceResource);
const DeleteDeviceResponse = defineGraphQlOkResponse("DeleteDeviceResponse", Boolean);

@InputType()
class CreateDeviceInput implements Partial<DeviceResource> {
  @Field(() => String, { description: "The UUID of the device" })
  deviceId!: string;

  @Field(() => String, { description: "The Expo push token of the device", nullable: true })
  expoPushToken?: string | null;

  @Field(() => String, { description: "The ID of the last user to log in on this device", nullable: true })
  lastUserId?: string | null;
}

@InputType()
class ListQueryArgs extends UnfilteredListQueryArgs<"deviceId" | "expoPushToken" | "lastUserId" | "lastLogin"> {
  @Field(() => StringFilterItem, { nullable: true })
  expoPushToken?: StringFilterItem;

  @Field(() => StringFilterItem, { nullable: true })
  lastUserId?: StringFilterItem;

  @Field(() => DateFilterItem, { nullable: true })
  lastLogin?: DateFilterItem;
}

const GetByUuidResponseUnion = withGraphQLErrorUnion(GetDeviceByUuidResponse, "GetDeviceByUuidResponse");
const ListResponseUnion = withGraphQLErrorUnion(ListDevicesResponse, "ListDevicesResponse");
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

  @Query(() => ListResponseUnion, { name: "listDevices" })
  async list(@Arg("query", () => ListQueryArgs) query: ListQueryArgs): Promise<typeof ListResponseUnion> {
    const findOptions = query.toSequelizeFindOptions({
      deviceId: "deviceId",
      expoPushToken: "expoPushToken",
      lastUserId: "lastUserId",
      lastLogin: "lastLogin",
    });

    findOptions.where = {
      ...(findOptions.where ?? {}),
      ...(query.expoPushToken != null ? { expoPushToken: { [query.expoPushToken.comparison]: query.expoPushToken.value } } : {}),
      ...(query.lastUserId != null ? { lastUserId: { [query.lastUserId.comparison]: query.lastUserId.value } } : {}),
      ...(query.lastLogin != null ? { lastLogin: { [query.lastLogin.comparison]: query.lastLogin.value } } : {}),
    };

    const { rows, count } = await DeviceModel.findAndCountAll(findOptions);

    return ListDevicesResponse.newPaginated(rows.map((row) => new DeviceIntermediate(row).toResource()), count, query.page, query.pageSize);
  }

  @Mutation(() => CreateResponseUnion, { name: "createDevice" })
  async create(@Arg("input") input: CreateDeviceInput): Promise<typeof CreateResponseUnion> {
    let lastUserId: number | null = null;

    if (input.lastUserId != null) {
      const lastUser = await PersonModel.findOne({ where: { uuid: input.lastUserId } });
      if (lastUser == null) {
        return GraphQLErrorResponse.from("Last user not found", ErrorCode.NotFound);
      }
      lastUserId = lastUser.id;
    }

    const row = await DeviceModel.create({
      uuid: input.deviceId,
      expoPushToken: input.expoPushToken ?? null,
      lastUserId,
    });

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

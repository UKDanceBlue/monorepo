import { DeviceResource, ErrorCode } from "@ukdanceblue/common";
import {
  Arg,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";

import { DeviceIntermediate, DeviceModel } from "../models/Device.js";
import { PersonModel } from "../models/Person.js";

import {
  AbstractGraphQLCreatedResponse,
  AbstractGraphQLOkResponse,
  AbstractGraphQLPaginatedResponse,
  DetailedError,
} from "./ApiResponse.js";
import {
  DateFilterItem,
  FilteredListQueryArgs,
  StringFilterItem,
  UnfilteredListQueryArgs,
} from "./ListQueryArgs.js";
import type { ResolverInterface } from "./ResolverInterface.js";

@ObjectType("GetDeviceByUuidResponse", {
  implements: AbstractGraphQLOkResponse<DeviceResource>,
})
class GetDeviceByUuidResponse extends AbstractGraphQLOkResponse<DeviceResource> {
  @Field(() => DeviceResource, { description: "The payload of the response" })
  data!: DeviceResource;
}
@ObjectType("ListDevicesResponse", {
  implements: AbstractGraphQLPaginatedResponse<DeviceResource>,
})
class ListDevicesResponse extends AbstractGraphQLPaginatedResponse<DeviceResource> {
  @Field(() => [DeviceResource], { description: "The payload of the response" })
  data!: DeviceResource[];
}
@ObjectType("CreateDeviceResponse", {
  implements: AbstractGraphQLCreatedResponse<DeviceResource>,
})
class CreateDeviceResponse extends AbstractGraphQLCreatedResponse<DeviceResource> {
  @Field(() => DeviceResource, { description: "The payload of the response" })
  data!: DeviceResource;
}
@ObjectType("DeleteDeviceResponse", {
  implements: AbstractGraphQLOkResponse<boolean>,
})
class DeleteDeviceResponse extends AbstractGraphQLOkResponse<boolean> {
  @Field(() => Boolean, { description: "The payload of the response" })
  data!: boolean;
}

@InputType()
class CreateDeviceInput implements Partial<DeviceResource> {
  @Field(() => String, { description: "The UUID of the device" })
  deviceId!: string;

  @Field(() => String, {
    description: "The Expo push token of the device",
    nullable: true,
  })
  expoPushToken?: string | null;

  @Field(() => String, {
    description: "The ID of the last user to log in on this device",
    nullable: true,
  })
  lastUserId?: string | null;
}

@InputType()
class ListDevicesArgs extends FilteredListQueryArgs<
  "deviceId" | "expoPushToken" | "lastUserId" | "lastLogin",
  "expoPushToken" | "lastUserId",
  never,
  "lastLogin",
  never
> {}

@Resolver(() => DeviceResource)
export class DeviceResolver implements ResolverInterface<DeviceResource> {
  @Query(() => GetDeviceByUuidResponse, { name: "getDeviceByUuid" })
  async getByUuid(@Arg("uuid") uuid: string): Promise<GetDeviceByUuidResponse> {
    const row = await DeviceModel.findOne({ where: { uuid } });

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "Device not found");
    }

    return GetDeviceByUuidResponse.newOk(
      new DeviceIntermediate(row).toResource()
    );
  }

  @Query(() => ListDevicesResponse, { name: "listDevices" })
  async list(
    @Arg("query", () => ListDevicesArgs) query: ListDevicesArgs
  ): Promise<ListDevicesResponse> {
    const findOptions = query.toSequelizeFindOptions({
      deviceId: "deviceId",
      expoPushToken: "expoPushToken",
      lastUserId: "lastUserId",
      lastLogin: "lastLogin",
    });

    findOptions.where = {
      ...(findOptions.where ?? {}),
      ...(query.expoPushToken != null
        ? {
            expoPushToken: {
              [query.expoPushToken.comparison]: query.expoPushToken.value,
            },
          }
        : {}),
      ...(query.lastUserId != null
        ? {
            lastUserId: {
              [query.lastUserId.comparison]: query.lastUserId.value,
            },
          }
        : {}),
      ...(query.lastLogin != null
        ? { lastLogin: { [query.lastLogin.comparison]: query.lastLogin.value } }
        : {}),
    };

    const { rows, count } = await DeviceModel.findAndCountAll(findOptions);

    return ListDevicesResponse.newPaginated(
      rows.map((row) => new DeviceIntermediate(row).toResource()),
      count,
      query.page,
      query.pageSize
    );
  }

  @Mutation(() => CreateDeviceResponse, { name: "createDevice" })
  async create(
    @Arg("input") input: CreateDeviceInput
  ): Promise<CreateDeviceResponse> {
    let lastUserId: number | null = null;

    if (input.lastUserId != null) {
      const lastUser = await PersonModel.findOne({
        where: { uuid: input.lastUserId },
      });
      if (lastUser == null) {
        throw new DetailedError(ErrorCode.NotFound, "Last user not found");
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

  @Mutation(() => DeleteDeviceResponse, { name: "deleteDevice" })
  async delete(@Arg("id") id: string): Promise<DeleteDeviceResponse> {
    const row = await DeviceModel.findOne({
      where: { uuid: id },
      attributes: ["id"],
    });

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "Device not found");
    }

    await row.destroy();

    return DeleteDeviceResponse.newOk(true);
  }
}

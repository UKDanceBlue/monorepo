import { DeviceResource, ErrorCode, PersonResource } from "@ukdanceblue/common";
import {
  Arg,
  Args,
  ArgsType,
  Field,
  FieldResolver,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from "type-graphql";

import { DeviceModel } from "../models/Device.js";
import { PersonModel } from "../models/Person.js";

import {
  AbstractGraphQLCreatedResponse,
  AbstractGraphQLOkResponse,
  AbstractGraphQLPaginatedResponse,
  DetailedError,
} from "./ApiResponse.js";
import { FilteredListQueryArgs } from "./list-query-args/FilteredListQueryArgs.js";
import type {
  ResolverInterface,
  ResolverInterfaceWithFilteredList,
} from "./ResolverInterface.js";

@ObjectType("GetDeviceByUuidResponse", {
  implements: AbstractGraphQLOkResponse<DeviceResource>,
})
class GetDeviceByUuidResponse extends AbstractGraphQLOkResponse<DeviceResource> {
  @Field(() => DeviceResource)
  data!: DeviceResource;
}
@ObjectType("ListDevicesResponse", {
  implements: AbstractGraphQLPaginatedResponse<DeviceResource>,
})
class ListDevicesResponse extends AbstractGraphQLPaginatedResponse<DeviceResource> {
  @Field(() => [DeviceResource])
  data!: DeviceResource[];
}
@ObjectType("CreateDeviceResponse", {
  implements: AbstractGraphQLCreatedResponse<DeviceResource>,
})
class CreateDeviceResponse extends AbstractGraphQLCreatedResponse<DeviceResource> {
  @Field(() => DeviceResource)
  data!: DeviceResource;
}
@ObjectType("DeleteDeviceResponse", {
  implements: AbstractGraphQLOkResponse<boolean>,
})
class DeleteDeviceResponse extends AbstractGraphQLOkResponse<boolean> {
  @Field(() => Boolean)
  data!: boolean;
}

@InputType()
class CreateDeviceInput implements Partial<DeviceResource> {
  @Field(() => String)
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

@ArgsType()
class ListDevicesArgs extends FilteredListQueryArgs("DeviceResolver", {
  all: ["deviceId", "expoPushToken", "lastLogin", "createdAt", "updatedAt"],
  string: ["deviceId", "expoPushToken"],
  date: ["lastLogin", "createdAt", "updatedAt"],
}) {}

@Resolver(() => DeviceResource)
export class DeviceResolver
  implements
    ResolverInterface<DeviceResource>,
    ResolverInterfaceWithFilteredList<DeviceResource, ListDevicesArgs>
{
  @Query(() => GetDeviceByUuidResponse, { name: "device" })
  async getByUuid(@Arg("uuid") uuid: string): Promise<GetDeviceByUuidResponse> {
    const row = await DeviceModel.findOne({ where: { uuid } });

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "Device not found");
    }

    return GetDeviceByUuidResponse.newOk(row.toResource());
  }

  @Query(() => ListDevicesResponse, { name: "devices" })
  async list(
    @Args(() => ListDevicesArgs) query: ListDevicesArgs
  ): Promise<ListDevicesResponse> {
    const findOptions = query.toSequelizeFindOptions({
      deviceId: "deviceId",
      expoPushToken: "expoPushToken",
      lastLogin: "lastLogin",
    });

    const { rows, count } = await DeviceModel.findAndCountAll(findOptions);

    return ListDevicesResponse.newPaginated({
      data: rows.map((row) => row.toResource()),
      total: count,
      page: query.page,
      pageSize: query.pageSize,
    });
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

    return CreateDeviceResponse.newOk(row.toResource());
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

  @FieldResolver(() => PersonResource, { nullable: true })
  async lastLoggedInUser(
    @Root() device: DeviceResource
  ): Promise<PersonResource | null> {
    const model = await DeviceModel.findByUuid(device.uuid, {
      attributes: ["lastUserId"],
      include: [PersonModel],
    });

    if (model == null) {
      throw new DetailedError(ErrorCode.NotFound, "Device not found");
    }

    return model.lastUser?.toResource() ?? null;
  }
}

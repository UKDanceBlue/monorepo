import {
  DetailedError,
  DeviceResource,
  ErrorCode,
  FilteredListQueryArgs,
  NotificationDeliveryResource,
  PersonResource,
  SortDirection,
} from "@ukdanceblue/common";
import {
  Arg,
  Args,
  ArgsType,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { Service } from "typedi";

import { auditLogger } from "../lib/logging/auditLogging.js";
import { DeviceRepository } from "../repositories/device/DeviceRepository.js";
import { deviceModelToResource } from "../repositories/device/deviceModelToResource.js";
import { notificationDeliveryModelToResource } from "../repositories/notificationDelivery/notificationDeliveryModelToResource.js";
import { personModelToResource } from "../repositories/person/personModelToResource.js";

import {
  AbstractGraphQLOkResponse,
  AbstractGraphQLPaginatedResponse,
} from "./ApiResponse.js";

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
@ObjectType("RegisterDeviceResponse", {
  implements: AbstractGraphQLOkResponse<DeviceResource>,
})
class RegisterDeviceResponse extends AbstractGraphQLOkResponse<DeviceResource> {
  @Field(() => DeviceResource)
  data!: DeviceResource;
}
@ObjectType("DeleteDeviceResponse", {
  implements: AbstractGraphQLOkResponse<boolean>,
})
class DeleteDeviceResponse extends AbstractGraphQLOkResponse<never> {}

@InputType()
class RegisterDeviceInput implements Partial<DeviceResource> {
  @Field(() => String)
  deviceId!: string;

  @Field(() => String, {
    description: "The Expo push token of the device",
    nullable: true,
  })
  expoPushToken?: string | null;

  @Field(() => String, {
    description: "base64 encoded SHA-256 hash of a secret known to the device",
  })
  verifier!: string;

  @Field(() => String, {
    description: "The ID of the last user to log in on this device",
    nullable: true,
  })
  lastUserId?: string | null;
}

@ArgsType()
class ListDevicesArgs extends FilteredListQueryArgs<
  "expoPushToken" | "lastSeen" | "createdAt" | "updatedAt",
  "expoPushToken",
  never,
  never,
  "lastSeen" | "createdAt" | "updatedAt",
  never
>("DeviceResolver", {
  all: ["expoPushToken", "lastSeen", "createdAt", "updatedAt"],
  string: ["expoPushToken"],
  date: ["lastSeen", "createdAt", "updatedAt"],
}) {}

@ArgsType()
class NotificationDeliveriesArgs {
  // TODO: Handle this in the normal authorization flow instead of here
  @Field(() => String, {
    nullable: true,
    description:
      "The verifier code for this device, if it does not match then the query will be rejected",
  })
  verifier?: string;

  @Field(() => Int, { nullable: true, defaultValue: 1 })
  page?: number;

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  pageSize?: number;
}

@Resolver(() => DeviceResource)
@Service()
export class DeviceResolver {
  constructor(private deviceRepository: DeviceRepository) {}

  @Query(() => GetDeviceByUuidResponse, { name: "device" })
  async getByUuid(@Arg("uuid") uuid: string): Promise<GetDeviceByUuidResponse> {
    const row = await this.deviceRepository.getDeviceByUuid(uuid);

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "Device not found");
    }

    return GetDeviceByUuidResponse.newOk(deviceModelToResource(row));
  }

  @Query(() => ListDevicesResponse, { name: "devices" })
  async list(
    @Args(() => ListDevicesArgs) query: ListDevicesArgs
  ): Promise<ListDevicesResponse> {
    const [rows, count] = await Promise.all([
      this.deviceRepository.listDevices({
        filters: query.filters,
        orderBy:
          query.sortBy?.map((key, i) => [
            key,
            query.sortDirection?.[i] ?? SortDirection.DESCENDING,
          ]) ?? [],
        skip:
          query.page != null && query.pageSize != null
            ? (query.page - 1) * query.pageSize
            : null,
        take: query.pageSize,
      }),
      this.deviceRepository.countDevices({ filters: query.filters }),
    ]);

    return ListDevicesResponse.newPaginated({
      data: rows.map((row) => deviceModelToResource(row)),
      total: count,
      page: query.page,
      pageSize: query.pageSize,
    });
  }

  @Mutation(() => RegisterDeviceResponse, { name: "registerDevice" })
  async register(
    @Arg("input") input: RegisterDeviceInput
  ): Promise<RegisterDeviceResponse> {
    const row = await this.deviceRepository.registerDevice(
      input.deviceId,
      input.verifier,
      {
        expoPushToken: input.expoPushToken ?? null,
        lastUserId: input.lastUserId ?? null,
      }
    );

    return RegisterDeviceResponse.newOk(deviceModelToResource(row));
  }

  @Mutation(() => DeleteDeviceResponse, { name: "deleteDevice" })
  async delete(@Arg("uuid") uuid: string): Promise<DeleteDeviceResponse> {
    await this.deviceRepository.deleteDevice({ uuid });

    auditLogger.normal("Device deleted", { uuid });

    return DeleteDeviceResponse.newOk(true);
  }

  @FieldResolver(() => PersonResource, { nullable: true })
  async lastLoggedInUser(
    @Root() device: DeviceResource
  ): Promise<PersonResource | null> {
    const user = await this.deviceRepository.getLastLoggedInUser(device.uuid);

    return user == null ? null : personModelToResource(user);
  }

  @FieldResolver(() => [NotificationDeliveryResource])
  async notificationDeliveries(
    @Root() device: DeviceResource,
    @Args(() => NotificationDeliveriesArgs) query: NotificationDeliveriesArgs
  ): Promise<NotificationDeliveryResource[]> {
    const row = await this.deviceRepository.getDeviceByUuid(device.uuid);

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "Device not found");
    }

    if (
      row.verifier != null &&
      (query.verifier == null || row.verifier !== query.verifier)
    ) {
      throw new DetailedError(
        ErrorCode.Unauthorized,
        "Incorrect device verifier"
      );
    }

    const rows =
      await this.deviceRepository.findNotificationDeliveriesForDevice(
        device.uuid,
        {
          skip:
            query.page != null && query.pageSize != null
              ? (query.page - 1) * query.pageSize
              : undefined,
          take: query.pageSize,
        }
      );

    return rows.map(notificationDeliveryModelToResource);
  }
}

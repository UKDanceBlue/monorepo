import type { GlobalId } from "@ukdanceblue/common";
import {
  DetailedError,
  DeviceNode,
  ErrorCode,
  FilteredListQueryArgs,
  GlobalIdScalar,
  NotificationDeliveryNode,
  PersonNode,
  SortDirection,
} from "@ukdanceblue/common";
import { ConcreteResult } from "@ukdanceblue/common/error";
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

import { auditLogger } from "#logging/auditLogging.js";
import { DeviceRepository } from "#repositories/device/DeviceRepository.js";
import { deviceModelToResource } from "#repositories/device/deviceModelToResource.js";
import { notificationDeliveryModelToResource } from "#repositories/notificationDelivery/notificationDeliveryModelToResource.js";
import { PersonRepository } from "#repositories/person/PersonRepository.js";
import { personModelToResource } from "#repositories/person/personModelToResource.js";
import {
  AbstractGraphQLOkResponse,
  AbstractGraphQLPaginatedResponse,
} from "#resolvers/ApiResponse.js";

@ObjectType("GetDeviceByUuidResponse", {
  implements: AbstractGraphQLOkResponse<DeviceNode>,
})
class GetDeviceByUuidResponse extends AbstractGraphQLOkResponse<DeviceNode> {
  @Field(() => DeviceNode)
  data!: DeviceNode;
}
@ObjectType("ListDevicesResponse", {
  implements: AbstractGraphQLPaginatedResponse<DeviceNode>,
})
class ListDevicesResponse extends AbstractGraphQLPaginatedResponse<DeviceNode> {
  @Field(() => [DeviceNode])
  data!: DeviceNode[];
}
@ObjectType("RegisterDeviceResponse", {
  implements: AbstractGraphQLOkResponse<DeviceNode>,
})
class RegisterDeviceResponse extends AbstractGraphQLOkResponse<DeviceNode> {
  @Field(() => DeviceNode)
  data!: DeviceNode;
}
@ObjectType("DeleteDeviceResponse", {
  implements: AbstractGraphQLOkResponse<boolean>,
})
class DeleteDeviceResponse extends AbstractGraphQLOkResponse<never> {}

@InputType()
class RegisterDeviceInput {
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

@Resolver(() => DeviceNode)
@Service()
export class DeviceResolver {
  constructor(
    private readonly deviceRepository: DeviceRepository,
    private readonly personRepository: PersonRepository
  ) {}

  @Query(() => GetDeviceByUuidResponse, { name: "device" })
  async getByUuid(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<GetDeviceByUuidResponse> {
    const row = await this.deviceRepository.getDeviceByUuid(id);

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
            query.sortDirection?.[i] ?? SortDirection.desc,
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
  async delete(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<DeleteDeviceResponse> {
    await this.deviceRepository.deleteDevice({ uuid: id });

    auditLogger.normal("Device deleted", { uuid: id });

    return DeleteDeviceResponse.newOk(true);
  }

  @FieldResolver(() => PersonNode, { nullable: true })
  async lastLoggedInUser(
    @Root() { id: { id } }: DeviceNode
  ): Promise<ConcreteResult<PersonNode>> {
    const user = await this.deviceRepository.getLastLoggedInUser(id);

    return user
      .toAsyncResult()
      .andThen((person) => personModelToResource(person, this.personRepository))
      .promise;
  }

  @FieldResolver(() => [NotificationDeliveryNode])
  async notificationDeliveries(
    @Root() { id: { id } }: DeviceNode,
    @Args(() => NotificationDeliveriesArgs) query: NotificationDeliveriesArgs
  ): Promise<NotificationDeliveryNode[]> {
    const row = await this.deviceRepository.getDeviceByUuid(id);

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
      await this.deviceRepository.findNotificationDeliveriesForDevice(id, {
        skip:
          query.page != null && query.pageSize != null
            ? (query.page - 1) * query.pageSize
            : undefined,
        take: query.pageSize,
      });

    return rows.map(notificationDeliveryModelToResource);
  }
}

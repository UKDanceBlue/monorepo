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

import {
  LegacyError,
  DeviceNode,
  LegacyErrorCode,
  FilteredListQueryArgs,
  GlobalIdScalar,
  NotificationDeliveryNode,
  parseGlobalId,
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
import { Service } from "@freshgum/typedi";

import type { GlobalId } from "@ukdanceblue/common";
import Validator from "validator";

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
  @Field(() => String, {
    description: "For legacy reasons, this can be a GlobalId or a raw UUID",
  })
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

  @Field(() => GlobalIdScalar, {
    description: "The ID of the last user to log in on this device",
    nullable: true,
  })
  lastUserId?: GlobalId | null;
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
@Service([DeviceRepository, PersonRepository])
export class DeviceResolver {
  constructor(
    private readonly deviceRepository: DeviceRepository,
    private readonly personRepository: PersonRepository
  ) {}

  @Query(() => GetDeviceByUuidResponse, {
    name: "device",
    description: "Get a device by it's UUID",
  })
  async getByUuid(
    @Arg("uuid", () => String, {
      description: "For legacy reasons, this can be a GlobalId or a raw UUID",
    })
    someId: string
  ): Promise<GetDeviceByUuidResponse> {
    const id = parseGlobalId(someId)
      .map((id) => id.id)
      .unwrapOr(someId);
    const row = await this.deviceRepository.getDeviceByUuid(id);

    if (row == null) {
      throw new LegacyError(LegacyErrorCode.NotFound, "Device not found");
    }

    return GetDeviceByUuidResponse.newOk(deviceModelToResource(row));
  }

  @Query(() => ListDevicesResponse, {
    name: "devices",
    description: "List all devices",
  })
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
          query.page != null && query.actualPageSize != null
            ? (query.page - 1) * query.actualPageSize
            : null,
        take: query.actualPageSize,
      }),
      this.deviceRepository.countDevices({ filters: query.filters }),
    ]);

    return ListDevicesResponse.newPaginated({
      data: rows.map((row) => deviceModelToResource(row)),
      total: count,
      page: query.page,
      pageSize: query.actualPageSize,
    });
  }

  @Mutation(() => RegisterDeviceResponse, {
    name: "registerDevice",
    description: "Register a new device, or update an existing one",
  })
  async register(
    @Arg("input") input: RegisterDeviceInput
  ): Promise<ConcreteResult<RegisterDeviceResponse>> {
    let deviceId: string;
    if (Validator.isUUID(input.deviceId)) {
      deviceId = input.deviceId;
    } else {
      const globalIdResult = parseGlobalId(input.deviceId);
      if (globalIdResult.isErr()) {
        return globalIdResult;
      }
      deviceId = globalIdResult.value.id;
    }
    const row = await this.deviceRepository.registerDevice(
      deviceId,
      input.verifier,
      {
        expoPushToken: input.expoPushToken ?? null,
        lastUserId: input.lastUserId?.id ?? null,
      }
    );

    return row.map((row) =>
      RegisterDeviceResponse.newOk(deviceModelToResource(row))
    );
  }

  @Mutation(() => DeleteDeviceResponse, {
    name: "deleteDevice",
    description: "Delete a device by it's UUID",
  })
  async delete(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<DeleteDeviceResponse> {
    await this.deviceRepository.deleteDevice({ uuid: id });

    auditLogger.secure("Device deleted", { uuid: id });

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

  @FieldResolver(() => [NotificationDeliveryNode], {
    description: "List all notification deliveries for this device",
  })
  async notificationDeliveries(
    @Root() { id: { id } }: DeviceNode,
    @Args(() => NotificationDeliveriesArgs) query: NotificationDeliveriesArgs
  ): Promise<NotificationDeliveryNode[]> {
    const row = await this.deviceRepository.getDeviceByUuid(id);

    if (row == null) {
      throw new LegacyError(LegacyErrorCode.NotFound, "Device not found");
    }

    if (
      row.verifier != null &&
      (query.verifier == null || row.verifier !== query.verifier)
    ) {
      throw new LegacyError(
        LegacyErrorCode.Unauthorized,
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

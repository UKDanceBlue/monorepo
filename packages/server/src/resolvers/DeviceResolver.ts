import { Service } from "@freshgum/typedi";
import type { CrudResolver, GlobalId } from "@ukdanceblue/common";
import {
  AccessControlAuthorized,
  DeviceNode,
  GetDeviceByUuidResponse,
  GlobalIdScalar,
  LegacyError,
  LegacyErrorCode,
  ListDevicesArgs,
  ListDevicesResponse,
  NotificationDeliveriesArgs,
  NotificationDeliveryNode,
  parseGlobalId,
  PersonNode,
  RegisterDeviceInput,
  RegisterDeviceResponse,
  SortDirection,
} from "@ukdanceblue/common";
import { ConcreteResult } from "@ukdanceblue/common/error";
import {
  Arg,
  Args,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import Validator from "validator";

import { DeviceRepository } from "#repositories/device/DeviceRepository.js";
import { PersonRepository } from "#repositories/person/PersonRepository.js";

@Resolver(() => DeviceNode)
@Service([DeviceRepository, PersonRepository])
export class DeviceResolver
  implements Omit<CrudResolver<DeviceNode, "device">, "device">
{
  constructor(
    private readonly deviceRepository: DeviceRepository,
    private readonly personRepository: PersonRepository
  ) {}

  @Query(() => GetDeviceByUuidResponse, {
    name: "device",
    description: "Get a device by it's UUID",
  })
  async device(
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

    const resp = new GetDeviceByUuidResponse();
    resp.data = deviceModelToResource(row);
    return resp;
  }

  @AccessControlAuthorized("list", "DeviceNode")
  @Query(() => ListDevicesResponse, {
    name: "devices",
    description: "List all devices",
  })
  async devices(
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
  async registerDevice(
    @Arg("input") input: RegisterDeviceInput
  ): AsyncResult<RegisterDeviceResponse, ConcreteError> {
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

    return row.map((row) => {
      const resp = new RegisterDeviceResponse();
      resp.ok = true;
      resp.data = deviceModelToResource(row);
      return resp;
    });
  }

  @AccessControlAuthorized("delete")
  @Mutation(() => DeviceNode, {
    name: "deleteDevice",
    description: "Delete a device by it's UUID",
  })
  async deleteDevice(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<DeviceNode> {
    const row = await this.deviceRepository.deleteDevice({ uuid: id });

    return deviceModelToResource(row);
  }

  @FieldResolver(() => PersonNode, { nullable: true })
  async lastLoggedInUser(
    @Root() { id: { id } }: DeviceNode
  ): AsyncResult<PersonNode, ConcreteError> {
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
      await this.deviceRepository.findNotificationDeliveriesForDevice(
        id,
        query.page != null && query.pageSize != null
          ? {
              skip: (query.page - 1) * query.pageSize,
              take: query.pageSize,
            }
          : {}
      );

    return rows.map(notificationDeliveryModelToResource);
  }
}

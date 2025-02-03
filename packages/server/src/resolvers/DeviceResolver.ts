import { Service } from "@freshgum/typedi";
import type { CrudResolver, GlobalId } from "@ukdanceblue/common";
import {
  AccessControlAuthorized,
  DeviceNode,
  GetDeviceByUuidResponse,
  GlobalIdScalar,
  ListDevicesArgs,
  ListDevicesResponse,
  NotificationDeliveriesArgs,
  NotificationDeliveryNode,
  parseGlobalId,
  PersonNode,
  RegisterDeviceInput,
  RegisterDeviceResponse,
} from "@ukdanceblue/common";
import {
  ConcreteResult,
  type ExtendedError,
  NotFoundError,
  UnauthenticatedError,
} from "@ukdanceblue/common/error";
import { Err, Ok, type Result } from "ts-results-es";
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

import { deviceModelToResource } from "#repositories/device/deviceModelToResource.js";
import { DeviceRepository } from "#repositories/device/DeviceRepository.js";
import { notificationDeliveryModelToResource } from "#repositories/notificationDelivery/notificationDeliveryModelToResource.js";
import { personModelToResource } from "#repositories/person/personModelToResource.js";
import { PersonRepository } from "#repositories/person/PersonRepository.js";
import type { AsyncRepositoryResult } from "#repositories/shared.js";

@Resolver(() => DeviceNode)
@Service([DeviceRepository, PersonRepository])
export class DeviceResolver
  implements Omit<CrudResolver<DeviceNode, "device">, "device">
{
  constructor(
    private readonly deviceRepository: DeviceRepository,
    private readonly personRepository: PersonRepository
  ) {}

  // There is no authentication check here, because nothing on the device model is sensitive. The UUID is security enough.
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
      throw new NotFoundError("Device");
    }

    const resp = new GetDeviceByUuidResponse();
    resp.data = deviceModelToResource(row);
    return resp;
  }

  @AccessControlAuthorized("list", ["every", "DeviceNode"])
  @Query(() => ListDevicesResponse, {
    name: "devices",
    description: "List all devices",
  })
  devices(
    @Args(() => ListDevicesArgs) query: ListDevicesArgs
  ): AsyncRepositoryResult<ListDevicesResponse> {
    return this.deviceRepository
      .findAndCount({
        filters: query.filters,
        sortBy: query.sortBy,
        offset: query.offset,
        limit: query.limit,
        search: query.search,
      })
      .map(({ selectedRows, total }) => {
        return ListDevicesResponse.newPaginated({
          data: selectedRows.map((row) => deviceModelToResource(row)),
          total,
        });
      });
  }

  @Mutation(() => RegisterDeviceResponse, {
    name: "registerDevice",
    description: "Register a new device, or update an existing one",
  })
  async registerDevice(
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

    return row.map((row) => {
      const resp = new RegisterDeviceResponse();
      resp.ok = true;
      resp.data = deviceModelToResource(row);
      return resp;
    });
  }

  @AccessControlAuthorized("delete", ["getId", "DeviceNode", "id"])
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
  ): Promise<Result<NotificationDeliveryNode[], ExtendedError>> {
    const row = await this.deviceRepository.getDeviceByUuid(id);

    if (row == null) {
      return Err(new NotFoundError("Device"));
    }

    if (
      row.verifier != null &&
      (query.verifier == null || row.verifier !== query.verifier)
    ) {
      return Err(new UnauthenticatedError());
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

    return Ok(rows.map(notificationDeliveryModelToResource));
  }
}

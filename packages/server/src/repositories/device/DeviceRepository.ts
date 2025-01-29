import { Service } from "@freshgum/typedi";
import type { Person, Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import type {
  FieldsOfListQueryArgs,
  ListDevicesArgs,
} from "@ukdanceblue/common";
import { NotFoundError } from "@ukdanceblue/common/error";
import { Err, Ok, Result } from "ts-results-es";

import type { NotificationAudience } from "#notification/NotificationProvider.js";
import { PersonRepository } from "#repositories/person/PersonRepository.js";
import {
  type AsyncRepositoryResult,
  RepositoryError,
  type SimpleUniqueParam,
} from "#repositories/shared.js";

type DeviceFields = FieldsOfListQueryArgs<ListDevicesArgs>;

import type { DefaultArgs } from "@prisma/client/runtime/library";

import { PrismaService } from "#lib/prisma.js";
import {
  buildDefaultRepository,
  type FindAndCountParams,
  type FindAndCountResult,
} from "#repositories/Default.js";

@Service([PrismaService, PersonRepository])
export class DeviceRepository extends buildDefaultRepository<
  PrismaClient["device"],
  SimpleUniqueParam,
  DeviceFields,
  never
>("Device", {
  lastLogin: {
    getOrderBy: (sort) => Ok({ lastSeen: sort }),
    getWhere: (value) => Ok({ lastSeen: value }),
  },
  lastLoggedInUserName: {
    getOrderBy: (sort) => Ok({ lastSeenPerson: { name: sort } }),
    getWhere: (value) => Ok({ lastSeenPerson: { name: value } }),
    searchable: true,
  },
  lastLoggedInUserEmail: {
    getOrderBy: (sort) => Ok({ lastSeenPerson: { email: sort } }),
    getWhere: (value) => Ok({ lastSeenPerson: { email: value } }),
    searchable: true,
  },
  createdAt: {
    getOrderBy: (sort) => Ok({ createdAt: sort }),
    getWhere: (value) => Ok({ createdAt: value }),
  },
  updatedAt: {
    getOrderBy: (sort) => Ok({ updatedAt: sort }),
    getWhere: (value) => Ok({ updatedAt: value }),
  },
}) {
  constructor(
    protected readonly prisma: PrismaService,
    private personRepository: PersonRepository
  ) {
    super(prisma);
  }

  public uniqueToWhere(by: SimpleUniqueParam): Prisma.DeviceWhereUniqueInput {
    return DeviceRepository.simpleUniqueToWhere(by);
  }

  async getDeviceByUuid(uuid: string) {
    return this.prisma.device.findUnique({
      where: { uuid },
    });
  }

  async getLastLoggedInUser(
    deviceUuid: string
  ): Promise<Result<Person, RepositoryError>> {
    const device = await this.getDeviceByUuid(deviceUuid);
    if (device?.lastSeenPersonId == null) {
      return Err(new NotFoundError("Person"));
    }
    return this.personRepository
      .findPersonByUnique({
        id: device.lastSeenPersonId,
      })
      .then((result) =>
        result.andThen((person) =>
          person.toResult(new NotFoundError("last logged in user"))
        )
      );
  }

  findAndCount({
    tx,
    ...params
  }: FindAndCountParams<DeviceFields>): AsyncRepositoryResult<
    FindAndCountResult<
      Prisma.DeviceDelegate<DefaultArgs, Prisma.PrismaClientOptions>,
      { include: never }
    >
  > {
    return this.parseFindManyParams(params)
      .toAsyncResult()
      .andThen((params) =>
        this.handleQueryError((tx ?? this.prisma).device.findMany(params)).map(
          (rows) => ({ rows, params })
        )
      )
      .andThen(({ rows, params }) =>
        this.handleQueryError(
          (tx ?? this.prisma).device.count({
            where: params.where,
            orderBy: params.orderBy,
          })
        ).map((total) => ({
          selectedRows: rows,
          total,
        }))
      );
  }

  async findNotificationDeliveriesForDevice(
    deviceUuid: string,
    { skip, take }: { skip?: number; take?: number }
  ) {
    return this.prisma.notificationDelivery.findMany({
      where: {
        device: { uuid: deviceUuid },
      },
      orderBy: { sentAt: "desc" },
      take,
      skip,
    });
  }

  async registerDevice(
    deviceUuid: string,
    verifier: string,
    {
      expoPushToken,
      lastUserId,
    }: { expoPushToken: string | null; lastUserId: string | null }
  ) {
    let user: Person | null = null;

    if (lastUserId != null) {
      const userResult = await this.personRepository
        .findPersonByUnique({
          uuid: lastUserId,
        })
        .then((result) =>
          result.andThen((person) =>
            person.toResult(new NotFoundError("Person"))
          )
        );
      if (userResult.isErr()) {
        return userResult;
      } else {
        user = userResult.value;
      }
    }

    return Ok(
      await this.prisma.device.upsert({
        where: { uuid: deviceUuid },
        update: {
          expoPushToken,
          verifier,
          lastSeenPerson:
            user == null ? { disconnect: true } : { connect: { id: user.id } },
          lastSeen: new Date(),
        },
        create: {
          uuid: deviceUuid,
          expoPushToken,
          verifier,
          lastSeenPerson:
            user == null ? undefined : { connect: { id: user.id } },
          lastSeen: new Date(),
        },
      })
    );
  }

  async unsubscribeFromNotifications(
    param: { uuid: string } | { id: number } | { expoPushToken: string }
  ) {
    return this.prisma.device.updateMany({
      where: param,
      data: {
        expoPushToken: null,
      },
    });
  }

  async deleteDevice(param: { uuid: string } | { id: number }) {
    return this.prisma.device.delete({
      where: param,
    });
  }

  async lookupNotificationAudience(
    audience: NotificationAudience
  ): Promise<{ id: number; uuid: string; expoPushToken: string }[]> {
    const where: Exclude<
      Exclude<
        Parameters<PrismaClient["device"]["findMany"]>[0],
        undefined
      >["where"],
      undefined
    >[] = [];

    if (audience !== "all") {
      if ("memberOfTeamType" in audience) {
        where.push({
          lastSeenPerson: {
            memberships: {
              some: {
                team: {
                  type: audience.memberOfTeamType,
                },
              },
            },
          },
        });
      }
      if ("memberOfTeamIds" in audience) {
        where.push({
          lastSeenPerson: {
            memberships: {
              some: {
                team: {
                  uuid: {
                    in: audience.memberOfTeamIds,
                  },
                },
              },
            },
          },
        });
      }
      if ("personIds" in audience) {
        where.push({
          lastSeenPerson: {
            uuid: {
              in: audience.personIds,
            },
          },
        });
      }

      if (where.length === 0) {
        throw new Error("Not implemented");
      }
    }

    const rows = await this.prisma.device.findMany({
      select: { id: true, uuid: true, expoPushToken: true },
      where: {
        AND: [{ expoPushToken: { not: null } }, ...where],
      },
      // It is possible for a device to be registered multiple times, so we
      // need to dedupe them somehow. To achieve this, we will use the
      // `expoPushToken` as the key and only keep the last seen device.
      orderBy: { lastSeen: "asc" },
    });

    const pushTokenToDevice = new Map<
      string,
      Omit<(typeof rows)[number], "expoPushToken"> & { expoPushToken: string }
    >();
    for (const device of rows) {
      if (device.expoPushToken != null) {
        pushTokenToDevice.set(
          device.expoPushToken,
          device as Omit<typeof device, "expoPushToken"> & {
            expoPushToken: string;
          }
        );
      }
    }

    return [...pushTokenToDevice.values()];
  }
}

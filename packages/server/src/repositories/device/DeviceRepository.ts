import type { Person } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import type { SortDirection } from "@ukdanceblue/common";
import { Err, Result } from "ts-results-es";
import { Service } from "typedi";

import { NotFoundError } from "../../lib/error/direct.js";
import { CatchableConcreteError } from "../../lib/formatError.js";
import type { NotificationAudience } from "../../lib/notification/NotificationProvider.js";
import type { FilterItems } from "../../lib/prisma-utils/gqlFilterToPrismaFilter.js";
import { PersonRepository } from "../person/PersonRepository.js";
import { RepositoryError } from "../shared.js";

import { buildDeviceOrder, buildDeviceWhere } from "./deviceRepositoryUtils.js";

const deviceStringKeys = ["expoPushToken"] as const;
type DeviceStringKey = (typeof deviceStringKeys)[number];

const deviceDateKeys = ["lastSeen", "createdAt", "updatedAt"] as const;
type DeviceDateKey = (typeof deviceDateKeys)[number];

export type DeviceFilters = FilterItems<
  never,
  DeviceDateKey,
  never,
  never,
  never,
  DeviceStringKey
>;

@Service()
export class DeviceRepository {
  constructor(
    private prisma: PrismaClient,
    private personRepository: PersonRepository
  ) {}

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
      return Err(new NotFoundError({ what: "Person" }));
    }
    return this.personRepository.findPersonByUnique({
      id: device.lastSeenPersonId,
    });
  }

  async listDevices({
    filters,
    orderBy,
    skip,
    take,
  }: {
    filters: DeviceFilters[];
    orderBy: [string, SortDirection][] | undefined | null;
    skip?: number | undefined | null;
    take?: number | undefined | null;
  }) {
    const where = buildDeviceWhere(filters);
    const order = buildDeviceOrder(orderBy);

    return this.prisma.device.findMany({
      where,
      orderBy: order,
      take: take ?? undefined,
      skip: skip ?? undefined,
    });
  }

  async countDevices({ filters }: { filters: DeviceFilters[] }) {
    const where = buildDeviceWhere(filters);

    return this.prisma.device.count({ where });
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
      const userResult = await this.personRepository.findPersonByUnique({
        uuid: lastUserId,
      });
      if (userResult.isErr()) {
        throw new CatchableConcreteError(userResult.error);
      } else {
        user = userResult.value;
      }
    }

    return this.prisma.device.upsert({
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
        lastSeenPerson: user == null ? undefined : { connect: { id: user.id } },
        lastSeen: new Date(),
      },
    });
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

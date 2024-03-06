import type { Person } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import type { SortDirection } from "@ukdanceblue/common";
import { Service } from "typedi";

import type { NotificationAudience } from "../../lib/notification/NotificationProvider.js";
import type { FilterItems } from "../../lib/prisma-utils/gqlFilterToPrismaFilter.js";
import { PersonRepository } from "../person/PersonRepository.js";

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

  async getLastLoggedInUser(deviceUuid: string) {
    const device = await this.getDeviceByUuid(deviceUuid);

    return device?.lastSeenPersonId == null
      ? null
      : this.personRepository.findPersonById(device.lastSeenPersonId);
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
      user = await this.personRepository.findPersonByUuid(lastUserId);
      if (user == null) {
        throw new Error("Last user not found");
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
    if (audience === "all") {
      return this.prisma.device
        .findMany({
          select: { id: true, uuid: true, expoPushToken: true },
          where: { expoPushToken: { not: null } },
        })
        .then((devices) =>
          devices.filter(
            (
              device
            ): device is Omit<typeof device, "expoPushToken"> & {
              expoPushToken: Exclude<(typeof device)["expoPushToken"], null>;
            } => device.expoPushToken != null
          )
        );
    } else {
      throw new Error("Not implemented");
    }
  }
}

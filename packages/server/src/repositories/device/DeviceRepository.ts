import type { Person } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import type { SortDirection } from "@ukdanceblue/common";
import { Service } from "typedi";

import type { FilterItems } from "../../lib/prisma-utils/gqlFilterToPrismaFilter.js";
import { PersonRepository } from "../person/PersonRepository.js";

import { buildDeviceOrder, buildDeviceWhere } from "./deviceRepositoryUtils.js";

const deviceStringKeys = ["expoPushToken"] as const;
type DeviceStringKey = (typeof deviceStringKeys)[number];

const deviceDateKeys = ["lastLogin", "createdAt", "updatedAt"] as const;
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

    return device?.lastUserId == null
      ? null
      : this.personRepository.findPersonById(device.lastUserId);
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
        lastUser:
          user == null ? { disconnect: true } : { connect: { id: user.id } },
        lastLogin: new Date(),
      },
      create: {
        uuid: deviceUuid,
        expoPushToken,
        lastUser: user == null ? undefined : { connect: { id: user.id } },
        lastLogin: new Date(),
      },
    });
  }

  async deleteDevice(param: { uuid: string } | { id: number }) {
    return this.prisma.device.delete({
      where: param,
    });
  }
}

import { Prisma, PrismaClient } from "@prisma/client";
import type { SortDirection } from "@ukdanceblue/common";
import type { ExpoPushTicket } from "expo-server-sdk";
import type { DateTime } from "luxon";
import { Service } from "typedi";

import type { FilterItems } from "../../lib/prisma-utils/gqlFilterToPrismaFilter.js";

import {
  buildNotificationDeliveryOrder,
  buildNotificationDeliveryWhere,
} from "./notificationDeliveryRepositoryUtils.js";

const notificationDeliveryBooleanKeys = [] as const;
type NotificationDeliveryBooleanKey =
  (typeof notificationDeliveryBooleanKeys)[number];

const notificationDeliveryDateKeys = ["createdAt", "updatedAt"] as const;
type NotificationDeliveryDateKey =
  (typeof notificationDeliveryDateKeys)[number];

const notificationDeliveryIsNullKeys = [] as const;
type NotificationDeliveryIsNullKey =
  (typeof notificationDeliveryIsNullKeys)[number];

const notificationDeliveryNumericKeys = [] as const;
type NotificationDeliveryNumericKey =
  (typeof notificationDeliveryNumericKeys)[number];

const notificationDeliveryOneOfKeys = [] as const;
type NotificationDeliveryOneOfKey =
  (typeof notificationDeliveryOneOfKeys)[number];

const notificationDeliveryStringKeys = [] as const;
type NotificationDeliveryStringKey =
  (typeof notificationDeliveryStringKeys)[number];

export type NotificationDeliveryOrderKeys = "createdAt" | "updatedAt";

export type NotificationDeliveryFilters = FilterItems<
  NotificationDeliveryBooleanKey,
  NotificationDeliveryDateKey,
  NotificationDeliveryIsNullKey,
  NotificationDeliveryNumericKey,
  NotificationDeliveryOneOfKey,
  NotificationDeliveryStringKey
>;

type UniqueParam = { id: number } | { uuid: string };

@Service()
export class NotificationDeliveryRepository {
  constructor(private prisma: PrismaClient) {}

  findNotificationDeliveryByUnique(param: UniqueParam) {
    return this.prisma.notificationDelivery.findUnique({ where: param });
  }

  async findDeviceForDelivery(param: UniqueParam) {
    const data = await this.prisma.notificationDelivery.findUnique({
      where: param,
      select: { device: true },
    });

    return data?.device;
  }

  listNotificationDeliveries({
    filters,
    order,
    skip,
    take,
  }: {
    filters?: readonly NotificationDeliveryFilters[] | undefined | null;
    order?:
      | readonly [key: NotificationDeliveryOrderKeys, sort: SortDirection][]
      | undefined
      | null;
    skip?: number | undefined | null;
    take?: number | undefined | null;
  }) {
    const where = buildNotificationDeliveryWhere(filters);
    const orderBy = buildNotificationDeliveryOrder(order);

    return this.prisma.notificationDelivery.findMany({
      where,
      orderBy,
      skip: skip ?? undefined,
      take: take ?? undefined,
    });
  }

  countNotificationDeliveries({
    filters,
  }: {
    filters?: readonly NotificationDeliveryFilters[] | undefined | null;
  }) {
    const where = buildNotificationDeliveryWhere(filters);

    return this.prisma.notificationDelivery.count({
      where,
    });
  }

  async createNotificationDeliveries({
    deviceIds,
    notificationId,
  }: {
    deviceIds: number[];
    notificationId: number;
  }) {
    await this.prisma.notificationDelivery.createMany({
      data: deviceIds.map((deviceId) => ({
        deviceId,
        notificationId,
      })),
    });

    return this.prisma.notificationDelivery.findMany({
      where: {
        notificationId,
      },
      select: {
        device: { select: { id: true, expoPushToken: true } },
        uuid: true,
      },
    });
  }

  updateChunk({
    chunkUuid,
    tickets,
    sentAt,
  }: {
    chunkUuid: string;
    tickets: { ticket: ExpoPushTicket; deliveryUuid: string }[];
    sentAt: DateTime;
  }) {
    return this.prisma.$transaction(
      tickets.map(({ ticket, deliveryUuid }) =>
        this.prisma.notificationDelivery.update({
          where: { uuid: deliveryUuid },
          data:
            ticket.status === "ok"
              ? { sentAt: sentAt.toJSDate(), receiptId: ticket.id, chunkUuid }
              : { deliveryError: ticket.details?.error, chunkUuid },
        })
      )
    );
  }

  updateNotificationDelivery(
    param: UniqueParam,
    data: Prisma.NotificationDeliveryUpdateInput
  ) {
    try {
      return this.prisma.notificationDelivery.update({ where: param, data });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return null;
      } else {
        throw error;
      }
    }
  }

  deleteNotificationDelivery(param: UniqueParam) {
    try {
      return this.prisma.notificationDelivery.delete({ where: param });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return null;
      } else {
        throw error;
      }
    }
  }
}

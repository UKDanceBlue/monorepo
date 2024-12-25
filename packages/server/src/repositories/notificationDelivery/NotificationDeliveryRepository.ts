import { Service } from "@freshgum/typedi";
import type { SortDirection } from "@ukdanceblue/common";
import type { ExpoPushReceipt, ExpoPushTicket } from "expo-server-sdk";
import type { DateTime } from "luxon";

import type { FilterItems } from "#lib/prisma-utils/gqlFilterToPrismaFilter.js";

import {
  buildNotificationDeliveryOrder,
  buildNotificationDeliveryWhere,
} from "./notificationDeliveryRepositoryUtils.js";

const notificationDeliveryBooleanKeys = [] as const;
type NotificationDeliveryBooleanKey =
  (typeof notificationDeliveryBooleanKeys)[number];

const notificationDeliveryDateKeys = [
  "createdAt",
  "updatedAt",
  "sentAt",
  "receiptCheckedAt",
] as const;
type NotificationDeliveryDateKey =
  (typeof notificationDeliveryDateKeys)[number];

const notificationDeliveryIsNullKeys = ["sentAt", "receiptCheckedAt"] as const;
type NotificationDeliveryIsNullKey =
  (typeof notificationDeliveryIsNullKeys)[number];

const notificationDeliveryNumericKeys = [] as const;
type NotificationDeliveryNumericKey =
  (typeof notificationDeliveryNumericKeys)[number];

const notificationDeliveryOneOfKeys = ["deliveryError"] as const;
type NotificationDeliveryOneOfKey =
  (typeof notificationDeliveryOneOfKeys)[number];

const notificationDeliveryStringKeys = [] as const;
type NotificationDeliveryStringKey =
  (typeof notificationDeliveryStringKeys)[number];

export type NotificationDeliveryOrderKeys =
  | "createdAt"
  | "updatedAt"
  | "sentAt"
  | "receiptCheckedAt"
  | "deliveryError";

export type NotificationDeliveryFilters = FilterItems<
  NotificationDeliveryBooleanKey,
  NotificationDeliveryDateKey,
  NotificationDeliveryIsNullKey,
  NotificationDeliveryNumericKey,
  NotificationDeliveryOneOfKey,
  NotificationDeliveryStringKey
>;

type UniqueParam = { id: number } | { uuid: string };

function normalizeReceiptErrorCode(
  code:
    | "DeviceNotRegistered"
    | "InvalidCredentials"
    | "MessageTooBig"
    | "MessageRateExceeded"
    | "DeveloperError"
    | "ExpoError"
    | "ProviderError"
    | undefined
): NotificationError {
  let normalizedCode: NotificationError;
  switch (code) {
    case "DeveloperError":
    case "ExpoError":
    case "ProviderError":
    case undefined: {
      normalizedCode = NotificationError.Unknown;

      // If this gives an error, it means that the above cases are incorrect
      code as NotificationError & typeof code satisfies never;

      break;
    }
    default: {
      normalizedCode = code;
    }
  }

  return normalizedCode;
}

import { drizzleToken } from "#lib/typediTokens.js";

@Service([drizzleToken])
export class NotificationDeliveryRepository {
  constructor(protected readonly db: Drizzle) {}

  findNotificationDeliveryByUnique(param: UniqueParam) {
    return this.prisma.notificationDelivery.findUnique({ where: param });
  }

  async findNotificationForDelivery(param: UniqueParam) {
    const val = await this.prisma.notificationDelivery.findUnique({
      where: param,
      select: { notification: true },
    });

    return val?.notification ?? null;
  }

  async findDeviceForDelivery(param: UniqueParam) {
    const data = await this.prisma.notificationDelivery.findUnique({
      where: param,
      select: { device: true },
    });

    return data?.device;
  }

  async findUncheckedDeliveries() {
    const returnVal = await this.prisma.notificationDelivery.findMany({
      where: {
        AND: [
          { receiptCheckedAt: null },
          { deliveryError: null },
          { receiptId: { not: null } },
        ],
      },
      select: { id: true, receiptId: true, device: { select: { id: true } } },
    });

    // THIS IS ONLY VALID SO LONG AS THE WHERE FOR receiptId IS NOT NULL
    return returnVal as (Omit<(typeof returnVal)[number], "receiptId"> & {
      receiptId: NonNullable<(typeof returnVal)[number]["receiptId"]>;
    })[];
  }

  listNotificationDeliveries(
    forNotification: UniqueParam,
    {
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
    }
  ) {
    const where = buildNotificationDeliveryWhere(filters);
    const orderBy = buildNotificationDeliveryOrder(order);

    return this.prisma.notificationDelivery.findMany({
      where: {
        AND: [{ notification: forNotification }, where],
      },
      orderBy,
      skip: skip ?? undefined,
      take: take ?? undefined,
    });
  }

  countNotificationDeliveries(
    notification: UniqueParam,
    {
      filters,
    }: {
      filters?: readonly NotificationDeliveryFilters[] | undefined | null;
    }
  ) {
    const where = buildNotificationDeliveryWhere(filters);

    return this.prisma.notificationDelivery.count({
      where: {
        AND: [{ notification }, where],
      },
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

  updateTicketChunk({
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
              : {
                  deliveryError: normalizeReceiptErrorCode(
                    ticket.details?.error
                  ),
                  chunkUuid,
                },
        })
      )
    );
  }

  updateReceiptChunk({
    receipts,
  }: {
    receipts: { receipt: ExpoPushReceipt; deliveryId: number }[];
  }) {
    // We can optimize this a bit by using a single query for all the successful
    // receipts, and then another one for each unique error message.

    const successfulDeliveries: number[] = [];
    // Map of error message to delivery IDs
    const errorReceipts = new Map<NotificationError, number[]>();
    for (const param of receipts) {
      if (param.receipt.status === "ok") {
        successfulDeliveries.push(param.deliveryId);
      } else {
        const errorCode = normalizeReceiptErrorCode(
          param.receipt.details?.error
        );
        const existing = errorReceipts.get(errorCode) ?? [];
        errorReceipts.set(errorCode, [...existing, param.deliveryId]);
      }
    }

    return this.prisma.$transaction([
      this.prisma.notificationDelivery.updateMany({
        where: { id: { in: successfulDeliveries } },
        data: { receiptCheckedAt: new Date() },
      }),
      ...[...errorReceipts.entries()].map(([error, deliveryIds]) =>
        this.prisma.notificationDelivery.updateMany({
          where: { id: { in: deliveryIds } },
          data: { deliveryError: error },
        })
      ),
    ]);
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

import { Service } from "@freshgum/typedi";
import { NotificationError, Prisma, PrismaClient } from "@prisma/client";
import type { ExpoPushReceipt, ExpoPushTicket } from "expo-server-sdk";
import type { DateTime } from "luxon";

type NotificationDeliveryUniqueParam = SimpleUniqueParam;

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

import type { DefaultArgs } from "@prisma/client/runtime/library";
import type {
  FieldsOfListQueryArgs,
  ListNotificationDeliveriesArgs,
} from "@ukdanceblue/common";
import { Ok } from "ts-results-es";

import { PrismaService } from "#lib/prisma.js";
import {
  buildDefaultRepository,
  type FindAndCountParams,
  type FindAndCountResult,
} from "#repositories/Default.js";
import { NotificationRepository } from "#repositories/notification/NotificationRepository.js";
import type {
  AsyncRepositoryResult,
  SimpleUniqueParam,
} from "#repositories/shared.js";

@Service([PrismaService, NotificationRepository])
export class NotificationDeliveryRepository extends buildDefaultRepository<
  PrismaClient["notificationDelivery"],
  SimpleUniqueParam,
  FieldsOfListQueryArgs<ListNotificationDeliveriesArgs>
>("NotificationDelivery", {
  deliveryError: {
    getWhere: (deliveryError) => Ok({ deliveryError }),
    getOrderBy: (deliveryError) => Ok({ deliveryError }),
  },
  sentAt: {
    getWhere: (sentAt) => Ok({ sentAt }),
    getOrderBy: (sentAt) => Ok({ sentAt }),
  },
  receiptCheckedAt: {
    getWhere: (receiptCheckedAt) => Ok({ receiptCheckedAt }),
    getOrderBy: (receiptCheckedAt) => Ok({ receiptCheckedAt }),
  },
  createdAt: {
    getWhere: (createdAt) => Ok({ createdAt }),
    getOrderBy: (createdAt) => Ok({ createdAt }),
  },
  updatedAt: {
    getWhere: (updatedAt) => Ok({ updatedAt }),
    getOrderBy: (updatedAt) => Ok({ updatedAt }),
  },
}) {
  constructor(
    protected readonly prisma: PrismaService,
    private readonly notificationRepository: NotificationRepository
  ) {
    super(prisma);
  }

  public uniqueToWhere(by: SimpleUniqueParam) {
    return NotificationDeliveryRepository.simpleUniqueToWhere(by);
  }

  findNotificationDeliveryByUnique(param: NotificationDeliveryUniqueParam) {
    return this.prisma.notificationDelivery.findUnique({ where: param });
  }

  async findNotificationForDelivery(param: NotificationDeliveryUniqueParam) {
    const val = await this.prisma.notificationDelivery.findUnique({
      where: param,
      select: { notification: true },
    });

    return val?.notification ?? null;
  }

  async findDeviceForDelivery(param: NotificationDeliveryUniqueParam) {
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

  findAndCount({
    tx,
    notification,
    ...params
  }: FindAndCountParams<
    "createdAt" | "updatedAt" | "sentAt" | "receiptCheckedAt" | "deliveryError"
  > & {
    notification?: SimpleUniqueParam;
  }): AsyncRepositoryResult<
    FindAndCountResult<
      Prisma.NotificationDeliveryDelegate<
        DefaultArgs,
        Prisma.PrismaClientOptions
      >,
      { include: Record<string, never> }
    >
  > {
    return this.parseFindManyParams(
      params,
      notification
        ? [
            {
              notification:
                this.notificationRepository.uniqueToWhere(notification),
            },
          ]
        : undefined
    )
      .toAsyncResult()
      .andThen((params) =>
        this.handleQueryError(
          (tx ?? this.prisma).notificationDelivery.findMany(params)
        ).map((rows) => ({ rows, params }))
      )
      .andThen(({ rows, params }) =>
        this.handleQueryError(
          (tx ?? this.prisma).notificationDelivery.count({
            where: params.where,
            orderBy: params.orderBy,
          })
        ).map((total) => ({
          selectedRows: rows,
          total,
        }))
      );
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
    param: NotificationDeliveryUniqueParam,
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

  deleteNotificationDelivery(param: NotificationDeliveryUniqueParam) {
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

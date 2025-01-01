import { Service } from "@freshgum/typedi";
import { Notification, Prisma, PrismaClient } from "@prisma/client";
import { NotificationError } from "@prisma/client";
import type { SortDirection } from "@ukdanceblue/common";

const notificationBooleanKeys = [] as const;
type NotificationBooleanKey = (typeof notificationBooleanKeys)[number];

const notificationDateKeys = [
  "createdAt",
  "updatedAt",
  "sendAt",
  "startedSendingAt",
  "deliveryIssueAcknowledgedAt",
] as const;
type NotificationDateKey = (typeof notificationDateKeys)[number];

const notificationIsNullKeys = [
  "createdAt",
  "updatedAt",
  "title",
  "body",
  "deliveryIssue",
  "sendAt",
  "startedSendingAt",
] as const;
type NotificationIsNullKey = (typeof notificationIsNullKeys)[number];

const notificationNumericKeys = [] as const;
type NotificationNumericKey = (typeof notificationNumericKeys)[number];

const notificationOneOfKeys = ["deliveryIssue"] as const;
type NotificationOneOfKey = (typeof notificationOneOfKeys)[number];

const notificationStringKeys = ["title", "body"] as const;
type NotificationStringKey = (typeof notificationStringKeys)[number];

export type NotificationOrderKeys =
  | "createdAt"
  | "updatedAt"
  | "title"
  | "body"
  | "deliveryIssue"
  | "deliveryIssueAcknowledgedAt"
  | "sendAt"
  | "startedSendingAt";

export type NotificationFilters = FilterItems<
  NotificationBooleanKey,
  NotificationDateKey,
  NotificationIsNullKey,
  NotificationNumericKey,
  NotificationOneOfKey,
  NotificationStringKey
>;

import { NotFoundError } from "@ukdanceblue/common/error";
import { AsyncResult, Err, Ok, Result } from "ts-results-es";

import { prismaToken } from "#lib/typediTokens.js";
import {
  handleRepositoryError,
  RepositoryError,
} from "#repositories/shared.js";

@Service([prismaToken])
export class NotificationRepository {
  constructor(private prisma: PrismaClient) {}

  findNotificationByUnique(param: Prisma.NotificationWhereUniqueInput) {
    return new AsyncResult(
      this.prisma.notification
        .findUnique({ where: param })
        .then(
          (result): Result<Notification, RepositoryError> =>
            result
              ? Ok(result)
              : Err(new NotFoundError({ what: "Notification" }))
        )
        .catch(handleRepositoryError)
    );
  }

  async findDeliveriesForNotification(
    param: Prisma.NotificationWhereUniqueInput
  ) {
    try {
      return Ok(
        await this.prisma.notificationDelivery.findMany({
          where: { notification: param },
          include: {
            device: {
              select: {
                expoPushToken: true,
                id: true,
              },
            },
          },
        })
      );
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  countDeliveriesForNotification(param: Prisma.NotificationWhereUniqueInput) {
    return this.prisma.notificationDelivery.count({
      where: { notification: param },
    });
  }

  async countFailedDeliveriesForNotification(
    param: Prisma.NotificationWhereUniqueInput
  ) {
    const rows = await this.prisma.notificationDelivery.groupBy({
      by: ["deliveryError"],
      _count: true,
      where: {
        notification: param,
        deliveryError: {
          not: null,
        },
      },
    });

    const record: Record<NotificationError, number> = {
      DeviceNotRegistered: 0,
      MessageTooBig: 0,
      InvalidCredentials: 0,
      MessageRateExceeded: 0,
      MismatchSenderId: 0,
      Unknown: 0,
    };
    for (const row of rows) {
      if (row.deliveryError !== null) {
        record[row.deliveryError] = row._count;
      }
    }

    return record;
  }

  listNotifications({
    filters,
    order,
    skip,
    take,
  }: {
    filters?: readonly NotificationFilters[] | undefined | null;
    order?:
      | readonly [key: NotificationOrderKeys, sort: SortDirection][]
      | undefined
      | null;
    skip?: number | undefined | null;
    take?: number | undefined | null;
  }) {
    const where = buildNotificationWhere(filters);
    const orderBy = buildNotificationOrder(order);

    return this.prisma.notification.findMany({
      where,
      orderBy,
      skip: skip ?? undefined,
      take: take ?? undefined,
    });
  }

  findScheduledNotifications() {
    return this.prisma.notification.findMany({
      where: {
        sendAt: {
          not: null,
        },
      },
    });
  }

  countNotifications({
    filters,
  }: {
    filters?: readonly NotificationFilters[] | undefined | null;
  }) {
    const where = buildNotificationWhere(filters);

    return this.prisma.notification.count({
      where,
    });
  }

  createNotification(data: {
    title: string;
    body: string;
    url?: string | undefined | null;
  }) {
    return this.prisma.notification.create({ data });
  }

  updateNotification(
    param: Prisma.NotificationWhereUniqueInput,
    data: Prisma.NotificationUpdateInput
  ) {
    return new AsyncResult(
      Result.wrapAsync(() =>
        this.prisma.notification.update({ where: param, data })
      )
    ).orElse(handleRepositoryError);
  }

  deleteNotification(param: Prisma.NotificationWhereUniqueInput) {
    try {
      return this.prisma.notification.delete({ where: param });
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

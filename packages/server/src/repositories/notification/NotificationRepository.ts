import { Service } from "@freshgum/typedi";
import { Notification, Prisma, PrismaClient } from "@prisma/client";
import { NotificationError } from "@prisma/client";
import type {
  FieldsOfListQueryArgs,
  ListNotificationsArgs,
} from "@ukdanceblue/common";
import { NotFoundError } from "@ukdanceblue/common/error";
import { AsyncResult, Err, Ok, Result } from "ts-results-es";

import { prismaToken } from "#lib/typediTokens.js";
import { buildDefaultRepository } from "#repositories/Default.js";
import {
  handleRepositoryError,
  RepositoryError,
  type SimpleUniqueParam,
} from "#repositories/shared.js";

@Service([prismaToken])
export class NotificationRepository extends buildDefaultRepository<
  PrismaClient["notification"],
  SimpleUniqueParam,
  FieldsOfListQueryArgs<ListNotificationsArgs>
>("Notification", {}) {
  constructor(protected readonly prisma: PrismaClient) {
    super(prisma);
  }

  public uniqueToWhere(by: SimpleUniqueParam) {
    return NotificationRepository.simpleUniqueToWhere(by);
  }

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

  findScheduledNotifications() {
    return this.prisma.notification.findMany({
      where: {
        sendAt: {
          not: null,
        },
      },
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

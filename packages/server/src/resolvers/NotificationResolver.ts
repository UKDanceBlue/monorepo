import { Service } from "@freshgum/typedi";
import type { CrudResolver, GlobalId } from "@ukdanceblue/common";
import {
  AccessControlAuthorized,
  GlobalIdScalar,
  LegacyError,
  LegacyErrorCode,
  NotificationDeliveryNode,
  NotificationNode,
  SortDirection,
} from "@ukdanceblue/common";
import {
  ListNotificationDeliveriesArgs,
  ListNotificationDeliveriesResponse,
  ListNotificationsArgs,
  ListNotificationsResponse,
  NotificationDeliveryIssueCount,
  StageNotificationArgs,
} from "@ukdanceblue/common";
import {
  ActionDeniedError,
  ConcreteResult,
  InvalidArgumentError,
} from "@ukdanceblue/common/error";
import { VoidResolver } from "graphql-scalars";
import { Err, Ok } from "ts-results-es";
import {
  Arg,
  Args,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";

import { NotificationScheduler } from "#jobs/NotificationScheduler.js";
import { ExpoNotificationProvider } from "#notification/ExpoNotificationProvider.js";
import * as NotificationProviderJs from "#notification/NotificationProvider.js";
import { notificationModelToResource } from "#repositories/notification/notificationModelToResource.js";
import { NotificationRepository } from "#repositories/notification/NotificationRepository.js";
import { notificationDeliveryModelToResource } from "#repositories/notificationDelivery/notificationDeliveryModelToResource.js";
import { NotificationDeliveryRepository } from "#repositories/notificationDelivery/NotificationDeliveryRepository.js";
import { handleRepositoryError } from "#repositories/shared.js";

@Resolver(() => NotificationNode)
@Service([
  NotificationRepository,
  NotificationDeliveryRepository,
  ExpoNotificationProvider,
  NotificationScheduler,
])
export class NotificationResolver
  implements CrudResolver<NotificationNode, "notification">
{
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly notificationDeliveryRepository: NotificationDeliveryRepository,
    private readonly notificationProvider: NotificationProviderJs.NotificationProvider,
    private readonly notificationScheduler: NotificationScheduler
  ) {}

  @AccessControlAuthorized("get")
  @Query(() => NotificationNode, { name: "notification" })
  async notification(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<ConcreteResult<NotificationNode>> {
    return this.notificationRepository
      .findNotificationByUnique({
        uuid: id,
      })
      .map((row) => notificationModelToResource(row)).promise;
  }

  @AccessControlAuthorized("list", "NotificationNode")
  @Query(() => ListNotificationsResponse, { name: "notifications" })
  async notifications(
    @Args(() => ListNotificationsArgs) query: ListNotificationsArgs
  ): Promise<ListNotificationsResponse> {
    const rows = await this.notificationRepository.listNotifications({
      filters: query.filters,
      order:
        query.sortBy?.map((key, i) => [
          key,
          query.sortDirection?.[i] ?? SortDirection.desc,
        ]) ?? [],
      skip:
        query.page != null && query.actualPageSize != null
          ? (query.page - 1) * query.actualPageSize
          : null,
      take: query.actualPageSize,
    });

    return ListNotificationsResponse.newPaginated({
      data: rows.map(notificationModelToResource),
      total: await this.notificationRepository.countNotifications({
        filters: query.filters,
      }),
      page: query.page,
      pageSize: query.actualPageSize,
    });
  }

  @AccessControlAuthorized("list", "NotificationDeliveryNode")
  @Query(() => ListNotificationDeliveriesResponse, {
    name: "notificationDeliveries",
  })
  async listDeliveries(
    @Args(() => ListNotificationDeliveriesArgs)
    query: ListNotificationDeliveriesArgs
  ): Promise<ListNotificationDeliveriesResponse> {
    const rows =
      await this.notificationDeliveryRepository.listNotificationDeliveries(
        { uuid: query.notificationUuid.id },
        {
          filters: query.filters,
          order:
            query.sortBy?.map((key, i) => [
              key,
              query.sortDirection?.[i] ?? SortDirection.desc,
            ]) ?? [],
          skip:
            query.page != null && query.actualPageSize != null
              ? (query.page - 1) * query.actualPageSize
              : null,
          take: query.actualPageSize,
        }
      );

    return ListNotificationDeliveriesResponse.newPaginated({
      data: rows.map(notificationDeliveryModelToResource),
      total:
        await this.notificationDeliveryRepository.countNotificationDeliveries(
          {
            uuid: query.notificationUuid.id,
          },
          {
            filters: query.filters,
          }
        ),
      page: query.page,
      pageSize: query.actualPageSize,
    });
  }

  @AccessControlAuthorized("create")
  @Mutation(() => NotificationNode, { name: "stageNotification" })
  async stage(
    @Args(() => StageNotificationArgs) args: StageNotificationArgs
  ): Promise<ConcreteResult<NotificationNode>> {
    if (Object.keys(args.audience).length === 0) {
      return Err(new InvalidArgumentError("Audience must be specified."));
    }

    if (args.audience.all && Object.keys(args.audience).length > 1) {
      return Err(
        new InvalidArgumentError(
          "Audience must not contain other fields if all is true."
        )
      );
    }

    const result = await this.notificationProvider.makeNotification(
      {
        title: args.title,
        body: args.body,
        url: args.url ? new URL(args.url) : undefined,
      },
      args.audience.all
        ? "all"
        : {
            memberOfTeamIds: args.audience.memberOfTeams?.map((id) => id.id),
            personIds: args.audience.users?.map((id) => id.id),
            memberOfTeamType: args.audience.memberOfTeamType ?? undefined,
          }
    ).promise;

    return result.map((result) => notificationModelToResource(result));
  }

  @AccessControlAuthorized("deploy", "NotificationNode")
  @Mutation(() => VoidResolver, {
    name: "sendNotification",
    description: "Send a notification immediately.",
  })
  async send(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<ConcreteResult<void>> {
    return this.notificationRepository
      .findNotificationByUnique({ uuid: id })
      .andThen((notification) =>
        notification.sendAt != null
          ? Err(
              new ActionDeniedError(
                "Cannot send a scheduled notification, cancel the schedule first."
              )
            )
          : Ok(notification)
      )
      .map(async (databaseNotification) => {
        await this.notificationProvider.sendNotification({
          value: databaseNotification,
        }).promise;
      }).promise;
  }

  @AccessControlAuthorized("deploy", "NotificationNode")
  @Mutation(() => NotificationNode, {
    name: "scheduleNotification",
  })
  async schedule(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId,
    @Arg("sendAt") sendAt: Date
  ): Promise<ConcreteResult<NotificationNode>> {
    this.notificationScheduler.ensureNotificationScheduler();

    return this.notificationRepository
      .findNotificationByUnique({ uuid: id })
      .andThen((notification) =>
        notification.startedSendingAt != null
          ? Err(new ActionDeniedError("Notification has already been sent."))
          : Ok(notification)
      )
      .andThen((notification) =>
        this.notificationRepository.updateNotification(
          { id: notification.id },
          { sendAt }
        )
      )
      .map(notificationModelToResource).promise;
  }

  @AccessControlAuthorized("update", "NotificationNode")
  @Mutation(() => NotificationNode, {
    name: "acknowledgeDeliveryIssue",
  })
  async acknowledgeDeliveryIssue(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<ConcreteResult<NotificationNode>> {
    const notification =
      await this.notificationRepository.findNotificationByUnique({ uuid: id })
        .promise;
    if (notification.isErr()) {
      return notification;
    }

    if (notification.value.deliveryIssue == null) {
      return Err(
        new InvalidArgumentError(
          "Notification has no delivery issue to acknowledge."
        )
      );
    }

    return this.notificationRepository
      .updateNotification(
        { id: notification.value.id },
        { deliveryIssueAcknowledgedAt: new Date() }
      )
      .map(notificationModelToResource).promise;
  }

  @AccessControlAuthorized("deploy", "NotificationNode")
  @Mutation(() => NotificationNode, {
    name: "abortScheduledNotification",
  })
  async abortScheduled(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<ConcreteResult<NotificationNode>> {
    return this.notificationRepository
      .findNotificationByUnique({ uuid: id })
      .andThen((notification) =>
        notification.startedSendingAt != null
          ? Err(new ActionDeniedError("Notification has already been sent."))
          : Ok(notification)
      )
      .andThen((notification) =>
        notification.sendAt == null
          ? Err(new InvalidArgumentError("Notification is not scheduled."))
          : Ok(notification)
      )
      .andThen((notification) =>
        this.notificationRepository.updateNotification(
          { id: notification.id },
          { sendAt: null }
        )
      )
      .map((notification) => notificationModelToResource(notification)).promise;
  }

  @AccessControlAuthorized("delete", "NotificationNode")
  @Mutation(() => NotificationNode, { name: "deleteNotification" })
  async deleteNotification(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId,
    @Arg("force", {
      nullable: true,
      description:
        "If true, the notification will be deleted even if it has already been sent, which will also delete the delivery records.",
    })
    force?: boolean
  ): Promise<ConcreteResult<NotificationNode>> {
    return this.notificationRepository
      .findNotificationByUnique({ uuid: id })
      .andThen((notification) =>
        notification.startedSendingAt != null && force !== true
          ? Err(
              new ActionDeniedError(
                "Cannot delete a notification that has already been sent without setting force to true."
              )
            )
          : Ok(notification)
      )
      .andThen(async (notification) => {
        try {
          return Ok(
            await this.notificationRepository.deleteNotification({
              id: notification.id,
            })
          );
        } catch (error) {
          return handleRepositoryError(error);
        }
      })
      .andThen((notification) =>
        notification == null
          ? Err(new InvalidArgumentError("Notification not found."))
          : Ok(notification)
      )
      .map(notificationModelToResource).promise;
  }

  @AccessControlAuthorized("get")
  @FieldResolver(() => Int, { name: "deliveryCount" })
  async deliveryCount(
    @Root() { id: { id } }: NotificationNode
  ): Promise<number> {
    return this.notificationRepository.countDeliveriesForNotification({
      uuid: id,
    });
  }

  @AccessControlAuthorized("get")
  @FieldResolver(() => NotificationDeliveryIssueCount, {
    name: "deliveryIssueCount",
  })
  async deliveryIssueCount(
    @Root() { id: { id } }: NotificationNode
  ): Promise<NotificationDeliveryIssueCount> {
    const issues =
      await this.notificationRepository.countFailedDeliveriesForNotification({
        uuid: id,
      });

    const retVal = new NotificationDeliveryIssueCount();
    Object.assign(retVal, issues);

    return retVal;
  }
}

@Resolver(() => NotificationDeliveryNode)
@Service([NotificationDeliveryRepository])
export class NotificationDeliveryResolver {
  constructor(
    private readonly notificationDeliveryRepository: NotificationDeliveryRepository
  ) {}

  @FieldResolver(() => NotificationNode, {
    name: "notification",
  })
  async getNotificationForDelivery(
    @Root() { id: { id } }: NotificationDeliveryNode
  ): Promise<NotificationNode> {
    const notification =
      await this.notificationDeliveryRepository.findNotificationForDelivery({
        uuid: id,
      });

    if (notification == null) {
      throw new LegacyError(LegacyErrorCode.NotFound, "Notification not found");
    }

    return notificationModelToResource(notification);
  }
}

import { NotificationScheduler } from "#jobs/NotificationScheduler.js";
import { ExpoNotificationProvider } from "#notification/ExpoNotificationProvider.js";
import * as NotificationProviderJs from "#notification/NotificationProvider.js";
import { NotificationRepository } from "#repositories/notification/NotificationRepository.js";
import { notificationModelToResource } from "#repositories/notification/notificationModelToResource.js";
import { NotificationDeliveryRepository } from "#repositories/notificationDelivery/NotificationDeliveryRepository.js";
import { notificationDeliveryModelToResource } from "#repositories/notificationDelivery/notificationDeliveryModelToResource.js";

import {
  QueryAccessControl,
  AccessLevel,
  LegacyError,
  LegacyErrorCode,
  GlobalIdScalar,
  NotificationDeliveryNode,
  NotificationNode,
  SortDirection,
  MutationAccessControl,
} from "@ukdanceblue/common";
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
import { Service } from "@freshgum/typedi";

import type { GlobalId } from "@ukdanceblue/common";
import {
  ActionDeniedError,
  ConcreteResult,
  InvalidArgumentError,
} from "@ukdanceblue/common/error";
import { Err, Ok } from "ts-results-es";
import { handleRepositoryError } from "#repositories/shared.js";
import {
  GetNotificationByUuidResponse,
  ListNotificationsResponse,
  ListNotificationsArgs,
  ListNotificationDeliveriesResponse,
  ListNotificationDeliveriesArgs,
  StageNotificationResponse,
  StageNotificationArgs,
  SendNotificationResponse,
  ScheduleNotificationResponse,
  AcknowledgeDeliveryIssueResponse,
  AbortScheduledNotificationResponse,
  DeleteNotificationResponse,
  NotificationDeliveryIssueCount,
} from "@ukdanceblue/common";

@Resolver(() => NotificationNode)
@Service([
  NotificationRepository,
  NotificationDeliveryRepository,
  ExpoNotificationProvider,
  NotificationScheduler,
])
export class NotificationResolver {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly notificationDeliveryRepository: NotificationDeliveryRepository,
    private readonly notificationProvider: NotificationProviderJs.NotificationProvider,
    private readonly notificationScheduler: NotificationScheduler
  ) {}

  @QueryAccessControl({
    accessLevel: AccessLevel.CommitteeChairOrCoordinator,
  })
  @Query(() => GetNotificationByUuidResponse, { name: "notification" })
  async getByUuid(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<ConcreteResult<GetNotificationByUuidResponse>> {
    return this.notificationRepository
      .findNotificationByUnique({
        uuid: id,
      })
      .map((row) =>
        GetNotificationByUuidResponse.newOk(notificationModelToResource(row))
      ).promise;
  }

  @QueryAccessControl({
    accessLevel: AccessLevel.CommitteeChairOrCoordinator,
  })
  @Query(() => ListNotificationsResponse, { name: "notifications" })
  async list(
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

  @QueryAccessControl({
    accessLevel: AccessLevel.CommitteeChairOrCoordinator,
  })
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

  @MutationAccessControl({
    accessLevel: AccessLevel.CommitteeChairOrCoordinator,
  })
  @Mutation(() => StageNotificationResponse, { name: "stageNotification" })
  async stage(
    @Args(() => StageNotificationArgs) args: StageNotificationArgs
  ): Promise<ConcreteResult<StageNotificationResponse>> {
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

    return result.map((result) =>
      StageNotificationResponse.newCreated(notificationModelToResource(result))
    );
  }

  @MutationAccessControl({
    accessLevel: AccessLevel.CommitteeChairOrCoordinator,
  })
  @Mutation(() => SendNotificationResponse, {
    name: "sendNotification",
    description: "Send a notification immediately.",
  })
  async send(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<ConcreteResult<SendNotificationResponse>> {
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

        return SendNotificationResponse.newOk(true);
      }).promise;
  }

  @MutationAccessControl({
    accessLevel: AccessLevel.CommitteeChairOrCoordinator,
  })
  @Mutation(() => ScheduleNotificationResponse, {
    name: "scheduleNotification",
  })
  async schedule(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId,
    @Arg("sendAt") sendAt: Date
  ): Promise<ConcreteResult<ScheduleNotificationResponse>> {
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
      .map(() => {
        this.notificationScheduler.ensureNotificationScheduler();

        return ScheduleNotificationResponse.newOk(true);
      }).promise;
  }

  @MutationAccessControl({
    accessLevel: AccessLevel.CommitteeChairOrCoordinator,
  })
  @Mutation(() => AcknowledgeDeliveryIssueResponse, {
    name: "acknowledgeDeliveryIssue",
  })
  async acknowledgeDeliveryIssue(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<ConcreteResult<AcknowledgeDeliveryIssueResponse>> {
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

    const result = await this.notificationRepository.updateNotification(
      { id: notification.value.id },
      { deliveryIssueAcknowledgedAt: new Date() }
    ).promise;
    if (result.isErr()) {
      return result;
    }

    return Ok(AcknowledgeDeliveryIssueResponse.newOk(true));
  }

  @MutationAccessControl({
    accessLevel: AccessLevel.CommitteeChairOrCoordinator,
  })
  @Mutation(() => AbortScheduledNotificationResponse, {
    name: "abortScheduledNotification",
  })
  async abortScheduled(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<ConcreteResult<AbortScheduledNotificationResponse>> {
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
      .map(() => AbortScheduledNotificationResponse.newOk(true)).promise;
  }

  @MutationAccessControl({
    accessLevel: AccessLevel.CommitteeChairOrCoordinator,
  })
  @Mutation(() => DeleteNotificationResponse, { name: "deleteNotification" })
  async delete(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId,
    @Arg("force", {
      nullable: true,
      description:
        "If true, the notification will be deleted even if it has already been sent, which will also delete the delivery records.",
    })
    force?: boolean
  ): Promise<ConcreteResult<DeleteNotificationResponse>> {
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
            this.notificationRepository.deleteNotification({
              id: notification.id,
            })
          );
        } catch (error) {
          return handleRepositoryError(error);
        }
      })
      .map(() => DeleteNotificationResponse.newOk(true)).promise;
  }

  @QueryAccessControl({
    accessLevel: AccessLevel.CommitteeChairOrCoordinator,
  })
  @FieldResolver(() => Int, { name: "deliveryCount" })
  async deliveryCount(
    @Root() { id: { id } }: NotificationNode
  ): Promise<number> {
    return this.notificationRepository.countDeliveriesForNotification({
      uuid: id,
    });
  }

  @QueryAccessControl({
    accessLevel: AccessLevel.CommitteeChairOrCoordinator,
  })
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

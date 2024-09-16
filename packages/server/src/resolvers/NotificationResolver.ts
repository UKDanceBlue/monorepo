import { NotificationScheduler } from "#jobs/NotificationScheduler.js";
import { ExpoNotificationProvider } from "#notification/ExpoNotificationProvider.js";
import * as NotificationProviderJs from "#notification/NotificationProvider.js";
import { NotificationRepository } from "#repositories/notification/NotificationRepository.js";
import { notificationModelToResource } from "#repositories/notification/notificationModelToResource.js";
import { NotificationDeliveryRepository } from "#repositories/notificationDelivery/NotificationDeliveryRepository.js";
import { notificationDeliveryModelToResource } from "#repositories/notificationDelivery/notificationDeliveryModelToResource.js";
import {
  AbstractGraphQLCreatedResponse,
  AbstractGraphQLOkResponse,
  AbstractGraphQLPaginatedResponse,
} from "#resolvers/ApiResponse.js";

import {
  AccessControl,
  AccessLevel,
  LegacyError,
  LegacyErrorCode,
  FilteredListQueryArgs,
  GlobalIdScalar,
  NotificationDeliveryNode,
  NotificationNode,
  SortDirection,
  TeamType,
} from "@ukdanceblue/common";
import {
  Arg,
  Args,
  ArgsType,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { Service } from "@freshgum/typedi";

import type { NotificationError } from "@prisma/client";
import type { GlobalId } from "@ukdanceblue/common";
import {
  ActionDeniedError,
  ConcreteResult,
  InvalidArgumentError,
} from "@ukdanceblue/common/error";
import { Err, Ok } from "ts-results-es";
import { handleRepositoryError } from "#repositories/shared.js";

@ObjectType("GetNotificationByUuidResponse", {
  implements: AbstractGraphQLOkResponse<NotificationNode>,
})
class GetNotificationByUuidResponse extends AbstractGraphQLOkResponse<NotificationNode> {
  @Field(() => NotificationNode)
  data!: NotificationNode;
}
@ObjectType("ListNotificationsResponse", {
  implements: AbstractGraphQLPaginatedResponse<NotificationNode>,
})
class ListNotificationsResponse extends AbstractGraphQLPaginatedResponse<NotificationNode> {
  @Field(() => [NotificationNode])
  data!: NotificationNode[];
}

@InputType()
class NotificationAudienceInput {
  @Field(() => Boolean, { nullable: true })
  all?: boolean;

  @Field(() => TeamType, { nullable: true })
  memberOfTeamType?: TeamType | null;

  @Field(() => [GlobalIdScalar], { nullable: true })
  memberOfTeams?: GlobalId[] | null;

  @Field(() => [GlobalIdScalar], { nullable: true })
  users?: GlobalId[] | null;
}

@ArgsType()
class StageNotificationArgs {
  @Field(() => String)
  title!: string;

  @Field(() => String)
  body!: string;

  @Field(() => String, { nullable: true })
  url?: string | null;

  @Field(() => NotificationAudienceInput)
  audience!: NotificationAudienceInput;
}

@ObjectType("StageNotificationResponse", {
  implements: AbstractGraphQLCreatedResponse<NotificationNode>,
})
class StageNotificationResponse extends AbstractGraphQLCreatedResponse<NotificationNode> {
  @Field(() => NotificationNode)
  data!: NotificationNode;
}

@ObjectType("SendNotificationResponse", {
  implements: AbstractGraphQLOkResponse<boolean>,
})
class SendNotificationResponse extends AbstractGraphQLOkResponse<boolean> {
  @Field(() => Boolean)
  data!: boolean;
}

@ObjectType("ScheduleNotificationResponse", {
  implements: AbstractGraphQLOkResponse<boolean>,
})
class ScheduleNotificationResponse extends AbstractGraphQLOkResponse<boolean> {
  @Field(() => Boolean)
  data!: boolean;
}

@ObjectType("AcknowledgeDeliveryIssueResponse", {
  implements: AbstractGraphQLOkResponse<boolean>,
})
class AcknowledgeDeliveryIssueResponse extends AbstractGraphQLOkResponse<boolean> {
  @Field(() => Boolean)
  data!: boolean;
}

@ObjectType("AbortScheduledNotificationResponse", {
  implements: AbstractGraphQLOkResponse<boolean>,
})
class AbortScheduledNotificationResponse extends AbstractGraphQLOkResponse<boolean> {
  @Field(() => Boolean)
  data!: boolean;
}

@ObjectType("DeleteNotificationResponse", {
  implements: AbstractGraphQLOkResponse<boolean>,
})
class DeleteNotificationResponse extends AbstractGraphQLOkResponse<boolean> {
  @Field(() => Boolean)
  data!: boolean;
}

@ArgsType()
class ListNotificationsArgs extends FilteredListQueryArgs<
  | "createdAt"
  | "updatedAt"
  | "title"
  | "body"
  | "deliveryIssue"
  | "sendAt"
  | "startedSendingAt",
  "title" | "body",
  "deliveryIssue",
  never,
  "createdAt" | "updatedAt" | "sendAt" | "startedSendingAt",
  never
>("NotificationResolver", {
  all: [
    "createdAt",
    "updatedAt",
    "title",
    "body",
    "deliveryIssue",
    "sendAt",
    "startedSendingAt",
  ],
  date: ["createdAt", "updatedAt", "sendAt", "startedSendingAt"],
  string: ["title", "body"],
  oneOf: ["deliveryIssue"],
}) {}

@ArgsType()
class ListNotificationDeliveriesArgs extends FilteredListQueryArgs<
  "createdAt" | "updatedAt" | "sentAt" | "receiptCheckedAt" | "deliveryError",
  never,
  "deliveryError",
  never,
  "createdAt" | "updatedAt" | "sentAt" | "receiptCheckedAt",
  never
>("NotificationDeliveryResolver", {
  all: [
    "createdAt",
    "updatedAt",
    "sentAt",
    "receiptCheckedAt",
    "deliveryError",
  ],
  date: ["createdAt", "updatedAt", "sentAt", "receiptCheckedAt"],
  oneOf: ["deliveryError"],
}) {
  @Field(() => GlobalIdScalar)
  notificationUuid!: GlobalId;
}

@ObjectType("ListNotificationDeliveriesResponse", {
  implements: AbstractGraphQLPaginatedResponse<NotificationDeliveryNode>,
})
class ListNotificationDeliveriesResponse extends AbstractGraphQLPaginatedResponse<NotificationDeliveryNode> {
  @Field(() => [NotificationDeliveryNode])
  data!: NotificationDeliveryNode[];
}

@ObjectType("NotificationDeliveryIssueCount", {
  description:
    "The number of delivery issues for a notification, broken down by type.",
})
class NotificationDeliveryIssueCount
  implements Record<NotificationError, number>
{
  @Field(() => Int)
  DeviceNotRegistered!: number;
  @Field(() => Int)
  InvalidCredentials!: number;
  @Field(() => Int)
  MessageTooBig!: number;
  @Field(() => Int)
  MessageRateExceeded!: number;
  @Field(() => Int)
  MismatchSenderId!: number;
  @Field(() => Int)
  Unknown!: number;
}

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

  @AccessControl({
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

  @AccessControl({
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

  @AccessControl({
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

  @AccessControl({
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

  @AccessControl({
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

  @AccessControl({
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

  @AccessControl({
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

  @AccessControl({
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

  @AccessControl({
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
    // const notification =
    //   await this.notificationRepository.findNotificationByUnique({ uuid: id });

    // if (notification == null) {
    //   throw new DetailedError(ErrorCode.NotFound, "Notification not found");
    // }

    // if (notification.startedSendingAt != null && force !== true) {
    //   throw new DetailedError(
    //     ErrorCode.InvalidRequest,
    //     "Cannot delete a notification that has already been sent without setting force to true."
    //   );
    // }

    // await this.notificationRepository.deleteNotification({
    //   id: notification.id,
    // });

    // return DeleteNotificationResponse.newOk(true);
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

  @AccessControl({
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

  @AccessControl({
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

import {
  DetailedError,
  ErrorCode,
  FilteredListQueryArgs,
  NotificationResource,
  SortDirection,
} from "@ukdanceblue/common";
import {
  Arg,
  Args,
  ArgsType,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { Inject, Service } from "typedi";

import { NotificationScheduler } from "../jobs/NotificationScheduler.js";
import { ExpoNotificationProvider } from "../lib/notification/ExpoNotificationProvider.js";
import * as NotificationProviderJs from "../lib/notification/NotificationProvider.js";
import { NotificationRepository } from "../repositories/notification/NotificationRepository.js";
import { notificationModelToResource } from "../repositories/notification/notificationModelToResource.js";

import {
  AbstractGraphQLCreatedResponse,
  AbstractGraphQLOkResponse,
  AbstractGraphQLPaginatedResponse,
} from "./ApiResponse.js";

@ObjectType("GetNotificationByUuidResponse", {
  implements: AbstractGraphQLOkResponse<NotificationResource>,
})
class GetNotificationByUuidResponse extends AbstractGraphQLOkResponse<NotificationResource> {
  @Field(() => NotificationResource)
  data!: NotificationResource;
}
@ObjectType("ListNotificationsResponse", {
  implements: AbstractGraphQLPaginatedResponse<NotificationResource>,
})
class ListNotificationsResponse extends AbstractGraphQLPaginatedResponse<NotificationResource> {
  @Field(() => [NotificationResource])
  data!: NotificationResource[];
}

@InputType()
class NotificationAudienceInput {
  @Field(() => Boolean, { nullable: true })
  all?: boolean;
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
  implements: AbstractGraphQLCreatedResponse<NotificationResource>,
})
class StageNotificationResponse extends AbstractGraphQLCreatedResponse<NotificationResource> {
  @Field(() => NotificationResource)
  data!: NotificationResource;
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
  "createdAt" | "updatedAt" | "title" | "body",
  "title" | "body",
  never,
  never,
  "createdAt" | "updatedAt",
  never
>("NotificationResolver", {
  all: ["createdAt", "updatedAt", "title", "body"],
  date: ["createdAt", "updatedAt"],
  string: ["title", "body"],
}) {}

@Resolver(() => NotificationResource)
@Service()
export class NotificationResolver {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    @Inject(() => ExpoNotificationProvider)
    private readonly notificationProvider: NotificationProviderJs.NotificationProvider,
    private readonly notificationScheduler: NotificationScheduler
  ) {}

  @Query(() => GetNotificationByUuidResponse, { name: "notification" })
  async getByUuid(
    @Arg("uuid") uuid: string
  ): Promise<GetNotificationByUuidResponse> {
    const row = await this.notificationRepository.findNotificationByUnique({
      uuid,
    });

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "Notification not found");
    }

    return GetNotificationByUuidResponse.newOk(
      notificationModelToResource(row)
    );
  }

  @Query(() => ListNotificationsResponse, { name: "notifications" })
  async list(
    @Args(() => ListNotificationsArgs) query: ListNotificationsArgs
  ): Promise<ListNotificationsResponse> {
    const rows = await this.notificationRepository.listNotifications({
      filters: query.filters,
      order:
        query.sortBy?.map((key, i) => [
          key,
          query.sortDirection?.[i] ?? SortDirection.DESCENDING,
        ]) ?? [],
      skip:
        query.page != null && query.pageSize != null
          ? (query.page - 1) * query.pageSize
          : null,
      take: query.pageSize,
    });

    return ListNotificationsResponse.newPaginated({
      data: rows.map(notificationModelToResource),
      total: await this.notificationRepository.countNotifications({
        filters: query.filters,
      }),
      page: query.page,
      pageSize: query.pageSize,
    });
  }

  @Mutation(() => StageNotificationResponse, { name: "stageNotification" })
  async stage(
    @Args(() => StageNotificationArgs) args: StageNotificationArgs
  ): Promise<StageNotificationResponse> {
    const result = await this.notificationProvider.makeNotification(
      {
        title: args.title,
        body: args.body,
        url: args.url ? new URL(args.url) : undefined,
      },
      args.audience.all ? "all" : {}
    );

    return StageNotificationResponse.newCreated(
      notificationModelToResource(result),
      result.uuid
    );
  }

  @Mutation(() => SendNotificationResponse, {
    name: "sendNotification",
    description: "Send a notification immediately.",
  })
  async send(@Arg("uuid") uuid: string): Promise<SendNotificationResponse> {
    const databaseNotification =
      await this.notificationRepository.findNotificationByUnique({ uuid });

    if (databaseNotification == null) {
      throw new DetailedError(ErrorCode.NotFound, "Notification not found");
    }

    if (databaseNotification.sendAt != null) {
      throw new DetailedError(
        ErrorCode.InvalidRequest,
        "Cannot send a scheduled notification, cancel the schedule first."
      );
    }

    await this.notificationProvider.sendNotification({
      value: databaseNotification,
    });

    return SendNotificationResponse.newOk(true);
  }

  @Mutation(() => ScheduleNotificationResponse, {
    name: "scheduleNotification",
  })
  async schedule(
    @Arg("uuid") uuid: string,
    @Arg("sendAt") sendAt: Date
  ): Promise<ScheduleNotificationResponse> {
    const notification =
      await this.notificationRepository.findNotificationByUnique({ uuid });

    if (notification == null) {
      throw new DetailedError(ErrorCode.NotFound, "Notification not found");
    }

    if (notification.startedSendingAt != null) {
      throw new DetailedError(
        ErrorCode.InvalidRequest,
        "Notification has already been sent."
      );
    }

    await this.notificationRepository.updateNotification(
      { id: notification.id },
      { sendAt }
    );

    this.notificationScheduler.ensureNotificationScheduler();

    return ScheduleNotificationResponse.newOk(true);
  }

  @Mutation(() => AcknowledgeDeliveryIssueResponse, {
    name: "acknowledgeDeliveryIssue",
  })
  async acknowledgeDeliveryIssue(
    @Arg("uuid") uuid: string
  ): Promise<AcknowledgeDeliveryIssueResponse> {
    const notification =
      await this.notificationRepository.findNotificationByUnique({ uuid });

    if (notification == null) {
      throw new DetailedError(ErrorCode.NotFound, "Notification not found");
    }

    if (notification.deliveryIssue == null) {
      throw new DetailedError(
        ErrorCode.InvalidRequest,
        "Notification has no delivery issue to acknowledge."
      );
    }

    await this.notificationRepository.updateNotification(
      { id: notification.id },
      { deliveryIssueAcknowledgedAt: new Date() }
    );

    return AcknowledgeDeliveryIssueResponse.newOk(true);
  }

  @Mutation(() => AbortScheduledNotificationResponse, {
    name: "abortScheduledNotification",
  })
  async abortScheduled(
    @Arg("uuid") uuid: string
  ): Promise<AbortScheduledNotificationResponse> {
    const notification =
      await this.notificationRepository.findNotificationByUnique({ uuid });

    if (notification == null) {
      throw new DetailedError(ErrorCode.NotFound, "Notification not found");
    }

    if (notification.startedSendingAt != null) {
      throw new DetailedError(
        ErrorCode.InvalidRequest,
        "Notification has already been sent."
      );
    }

    if (notification.sendAt == null) {
      throw new DetailedError(
        ErrorCode.InvalidRequest,
        "Notification is not scheduled."
      );
    }

    await this.notificationRepository.updateNotification(
      { id: notification.id },
      { sendAt: null }
    );

    return AbortScheduledNotificationResponse.newOk(true);
  }

  @Mutation(() => DeleteNotificationResponse, { name: "deleteNotification" })
  async delete(
    @Arg("uuid") uuid: string,
    @Arg("force", {
      nullable: true,
      description:
        "If true, the notification will be deleted even if it has already been sent, which will also delete the delivery records.",
    })
    force?: boolean
  ): Promise<DeleteNotificationResponse> {
    const notification =
      await this.notificationRepository.findNotificationByUnique({ uuid });

    if (notification == null) {
      throw new DetailedError(ErrorCode.NotFound, "Notification not found");
    }

    if (notification.startedSendingAt != null && force !== true) {
      throw new DetailedError(
        ErrorCode.InvalidRequest,
        "Cannot delete a notification that has already been sent without setting force to true."
      );
    }

    await this.notificationRepository.deleteNotification({
      id: notification.id,
    });

    return DeleteNotificationResponse.newOk(true);
  }
}

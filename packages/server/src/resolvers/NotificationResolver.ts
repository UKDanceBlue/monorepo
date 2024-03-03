import type { OptionalToNullable } from "@ukdanceblue/common";
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
import { Service } from "typedi";

import { auditLogger } from "../lib/logging/auditLogging.js";
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
@ObjectType("SendNotificationResponse", {
  implements: AbstractGraphQLCreatedResponse<NotificationResource>,
})
class SendNotificationResponse extends AbstractGraphQLCreatedResponse<NotificationResource> {
  @Field(() => NotificationResource)
  data!: NotificationResource;
}
@ObjectType("DeleteNotificationResponse", {
  implements: AbstractGraphQLOkResponse<boolean>,
})
class DeleteNotificationResponse extends AbstractGraphQLOkResponse<never> {}

@InputType()
class SendNotificationInput
  implements OptionalToNullable<Partial<NotificationResource>>
{
  @Field(() => String)
  title!: string;

  @Field(() => String)
  body!: string;
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
    private readonly notificationRepository: NotificationRepository
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

  @Mutation(() => SendNotificationResponse, { name: "sendNotification" })
  async create(
    @Arg("input") input: SendNotificationInput
  ): Promise<SendNotificationResponse> {
    return SendNotificationResponse.newOk(
      await Promise.resolve(input as NotificationResource)
    );
  }

  @Mutation(() => DeleteNotificationResponse, { name: "deleteNotification" })
  async delete(@Arg("uuid") uuid: string): Promise<DeleteNotificationResponse> {
    const row = await this.notificationRepository.deleteNotification({ uuid });

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "Notification not found");
    }

    auditLogger.sensitive("Notification deleted", {
      uuid: row.uuid,
      title: row.title,
      body: row.body,
    });

    return DeleteNotificationResponse.newOk(true);
  }
}

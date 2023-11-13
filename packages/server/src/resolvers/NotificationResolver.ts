import type { OptionalToNullable } from "@ukdanceblue/common";
import { ErrorCode, NotificationResource } from "@ukdanceblue/common";
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

import { selectAudience } from "../lib/notification/selectAudience.js";
import { sendNotification } from "../lib/notification/sendNotification.js";
import { NotificationModel } from "../models/Notification.js";

import {
  AbstractGraphQLCreatedResponse,
  AbstractGraphQLOkResponse,
  AbstractGraphQLPaginatedResponse,
  DetailedError,
} from "./ApiResponse.js";
import type {
  ResolverInterface,
  ResolverInterfaceWithFilteredList,
} from "./ResolverInterface.js";
import { FilteredListQueryArgs } from "./list-query-args/FilteredListQueryArgs.js";

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
class DeleteNotificationResponse extends AbstractGraphQLOkResponse<boolean> {
  @Field(() => Boolean)
  data!: boolean;
}

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
class ListNotificationsArgs extends FilteredListQueryArgs(
  "NotificationResolver",
  {
    all: ["uuid"],
  }
) {}

@Resolver(() => NotificationResource)
export class NotificationResolver
  implements
    ResolverInterface<NotificationResource>,
    ResolverInterfaceWithFilteredList<
      NotificationResource,
      ListNotificationsArgs
    >
{
  @Query(() => GetNotificationByUuidResponse, { name: "notification" })
  async getByUuid(
    @Arg("uuid") uuid: string
  ): Promise<GetNotificationByUuidResponse> {
    const row = await NotificationModel.findOne({ where: { uuid } });

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "Notification not found");
    }

    return GetNotificationByUuidResponse.newOk(row.toResource());
  }

  @Query(() => ListNotificationsResponse, { name: "notifications" })
  async list(
    @Args(() => ListNotificationsArgs) query: ListNotificationsArgs
  ): Promise<ListNotificationsResponse> {
    const findOptions = query.toSequelizeFindOptions(
      {
        uuid: "uuid",
      },
      NotificationModel
    );

    const { rows, count } =
      await NotificationModel.findAndCountAll(findOptions);

    return ListNotificationsResponse.newPaginated({
      data: rows.map((row) => row.toResource()),
      total: count,
      page: query.page,
      pageSize: query.pageSize,
    });
  }

  @Mutation(() => SendNotificationResponse, { name: "sendNotification" })
  async create(
    @Arg("input") input: SendNotificationInput
  ): Promise<SendNotificationResponse> {
    const row = await NotificationModel.create({
      title: input.title,
      body: input.body,
      sendTime: new Date(),
    });

    const audience = await selectAudience(row, {});
    await sendNotification(row.toResource(), audience);

    return SendNotificationResponse.newOk(row.toResource());
  }

  @Mutation(() => DeleteNotificationResponse, { name: "deleteNotification" })
  async delete(@Arg("uuid") id: string): Promise<DeleteNotificationResponse> {
    const row = await NotificationModel.findOne({
      where: { uuid: id },
      attributes: ["id"],
    });

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "Notification not found");
    }

    await row.destroy();

    return DeleteNotificationResponse.newOk(true);
  }
}

import {
  ErrorCode,
  NotificationResource,
  OptionalToNullable,
} from "@ukdanceblue/common";
import {
  Arg,
  Args,
  ArgsType,
  Field,
  ID,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";

import { NotificationModel } from "../models/Notification.js";

import {
  AbstractGraphQLCreatedResponse,
  AbstractGraphQLOkResponse,
  AbstractGraphQLPaginatedResponse,
  DetailedError,
} from "./ApiResponse.js";
import { FilteredListQueryArgs } from "./list-query-args/FilteredListQueryArgs.js";
import type {
  ResolverInterface,
  ResolverInterfaceWithFilteredList,
} from "./ResolverInterface.js";

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
@ObjectType("CreateNotificationResponse", {
  implements: AbstractGraphQLCreatedResponse<NotificationResource>,
})
class CreateNotificationResponse extends AbstractGraphQLCreatedResponse<NotificationResource> {
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
class CreateNotificationInput
  implements OptionalToNullable<Partial<NotificationResource>>
{
  @Field(() => ID)
  uuid!: string;
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

  @Mutation(() => CreateNotificationResponse, { name: "createNotification" })
  async create(
    @Arg("input") input: CreateNotificationInput
  ): Promise<CreateNotificationResponse> {
    const row = await NotificationModel.create({
      uuid: input.uuid,
    });

    return CreateNotificationResponse.newOk(row.toResource());
  }

  @Mutation(() => DeleteNotificationResponse, { name: "deleteNotification" })
  async delete(@Arg("id") id: string): Promise<DeleteNotificationResponse> {
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

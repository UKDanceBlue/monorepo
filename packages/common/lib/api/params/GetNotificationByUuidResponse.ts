import { GraphQLNonEmptyString, GraphQLURL } from "graphql-scalars";
import { ArgsType, Field, InputType, Int, ObjectType } from "type-graphql";

import { FilteredListQueryArgs } from "../filtering/FilteredListQueryArgs.js";
import {
  NotificationDeliveryNode,
  NotificationNode,
} from "../resources/Notification.js";
import { TeamType } from "../resources/Team.js";
import { type GlobalId, GlobalIdScalar } from "../scalars/GlobalId.js";
import { AbstractGraphQLPaginatedResponse } from "./ApiResponse.js";

@ObjectType("ListNotificationsResponse", {
  implements: AbstractGraphQLPaginatedResponse<NotificationNode>,
})
export class ListNotificationsResponse extends AbstractGraphQLPaginatedResponse<NotificationNode> {
  @Field(() => [NotificationNode])
  data!: NotificationNode[];
}

@InputType()
class NotificationAudienceInput {
  @Field(() => Boolean, { nullable: true })
  all?: boolean;

  @Field(() => TeamType, { nullable: true })
  memberOfTeamType?: TeamType | undefined | null;

  @Field(() => [GlobalIdScalar], { nullable: true })
  memberOfTeams?: GlobalId[] | undefined | null;

  @Field(() => [GlobalIdScalar], { nullable: true })
  users?: GlobalId[] | undefined | null;
}

@ArgsType()
export class StageNotificationArgs {
  @Field(() => GraphQLNonEmptyString)
  title!: string;

  @Field(() => GraphQLNonEmptyString)
  body!: string;

  @Field(() => GraphQLURL, { nullable: true })
  url?: string | undefined | null;

  @Field(() => NotificationAudienceInput)
  audience!: NotificationAudienceInput;
}

@ArgsType()
export class ListNotificationsArgs extends FilteredListQueryArgs(
  "NotificationResolver",
  [
    "createdAt",
    "updatedAt",
    "title",
    "body",
    "deliveryIssue",
    "sendAt",
    "startedSendingAt",
    "deliveryIssueAcknowledgedAt",
  ]
) {}

@ArgsType()
export class ListNotificationDeliveriesArgs extends FilteredListQueryArgs(
  "NotificationDeliveryResolver",
  ["createdAt", "updatedAt", "sentAt", "receiptCheckedAt", "deliveryError"]
) {
  @Field(() => GlobalIdScalar)
  notificationUuid!: GlobalId;
}

@ObjectType("ListNotificationDeliveriesResponse", {
  implements: AbstractGraphQLPaginatedResponse<NotificationDeliveryNode>,
})
export class ListNotificationDeliveriesResponse extends AbstractGraphQLPaginatedResponse<NotificationDeliveryNode> {
  @Field(() => [NotificationDeliveryNode])
  data!: NotificationDeliveryNode[];
}

@ObjectType("NotificationDeliveryIssueCount", {
  description:
    "The number of delivery issues for a notification, broken down by type.",
})
//implements Record<NotificationError, number>
export class NotificationDeliveryIssueCount {
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

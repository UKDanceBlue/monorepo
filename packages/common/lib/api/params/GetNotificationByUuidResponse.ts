import { NonEmptyStringResolver, URLResolver } from "graphql-scalars";
import { ArgsType, Field, InputType, Int, ObjectType } from "type-graphql";

import { FilteredListQueryArgs } from "../filtering/list-query-args/FilteredListQueryArgs.js";
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
  @Field(() => NonEmptyStringResolver)
  title!: string;

  @Field(() => NonEmptyStringResolver)
  body!: string;

  @Field(() => URLResolver, { nullable: true })
  url?: string | undefined | null;

  @Field(() => NotificationAudienceInput)
  audience!: NotificationAudienceInput;
}

@ArgsType()
export class ListNotificationsArgs extends FilteredListQueryArgs<
  | "createdAt"
  | "updatedAt"
  | "title"
  | "body"
  | "deliveryIssue"
  | "sendAt"
  | "startedSendingAt"
  | "deliveryIssueAcknowledgedAt",
  "title" | "body",
  "deliveryIssue",
  never,
  | "createdAt"
  | "updatedAt"
  | "sendAt"
  | "startedSendingAt"
  | "deliveryIssueAcknowledgedAt",
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
    "deliveryIssueAcknowledgedAt",
  ],
  date: [
    "createdAt",
    "updatedAt",
    "sendAt",
    "startedSendingAt",
    "deliveryIssueAcknowledgedAt",
  ],
  string: ["title", "body"],
  oneOf: ["deliveryIssue"],
}) {}

@ArgsType()
export class ListNotificationDeliveriesArgs extends FilteredListQueryArgs<
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

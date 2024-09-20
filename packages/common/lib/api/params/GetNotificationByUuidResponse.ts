import type { NotificationError } from "@prisma/client";
import {
  NotificationNode,
  TeamType,
  GlobalIdScalar,
  type GlobalId,
  FilteredListQueryArgs,
  NotificationDeliveryNode,
} from "@ukdanceblue/common";
import { ObjectType, Field, InputType, ArgsType, Int } from "type-graphql";
import {
  AbstractGraphQLOkResponse,
  AbstractGraphQLPaginatedResponse,
  AbstractGraphQLCreatedResponse,
} from "./ApiResponse.js";

@ObjectType("GetNotificationByUuidResponse", {
  implements: AbstractGraphQLOkResponse<NotificationNode>,
})
export class GetNotificationByUuidResponse extends AbstractGraphQLOkResponse<NotificationNode> {
  @Field(() => NotificationNode)
  data!: NotificationNode;
}
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
  memberOfTeamType?: TeamType | null;

  @Field(() => [GlobalIdScalar], { nullable: true })
  memberOfTeams?: GlobalId[] | null;

  @Field(() => [GlobalIdScalar], { nullable: true })
  users?: GlobalId[] | null;
}

@ArgsType()
export class StageNotificationArgs {
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
export class StageNotificationResponse extends AbstractGraphQLCreatedResponse<NotificationNode> {
  @Field(() => NotificationNode)
  data!: NotificationNode;
}

@ObjectType("SendNotificationResponse", {
  implements: AbstractGraphQLOkResponse<boolean>,
})
export class SendNotificationResponse extends AbstractGraphQLOkResponse<boolean> {
  @Field(() => Boolean)
  data!: boolean;
}

@ObjectType("ScheduleNotificationResponse", {
  implements: AbstractGraphQLOkResponse<boolean>,
})
export class ScheduleNotificationResponse extends AbstractGraphQLOkResponse<boolean> {
  @Field(() => Boolean)
  data!: boolean;
}

@ObjectType("AcknowledgeDeliveryIssueResponse", {
  implements: AbstractGraphQLOkResponse<boolean>,
})
export class AcknowledgeDeliveryIssueResponse extends AbstractGraphQLOkResponse<boolean> {
  @Field(() => Boolean)
  data!: boolean;
}

@ObjectType("AbortScheduledNotificationResponse", {
  implements: AbstractGraphQLOkResponse<boolean>,
})
export class AbortScheduledNotificationResponse extends AbstractGraphQLOkResponse<boolean> {
  @Field(() => Boolean)
  data!: boolean;
}

@ObjectType("DeleteNotificationResponse", {
  implements: AbstractGraphQLOkResponse<boolean>,
})
export class DeleteNotificationResponse extends AbstractGraphQLOkResponse<boolean> {
  @Field(() => Boolean)
  data!: boolean;
}

@ArgsType()
export class ListNotificationsArgs extends FilteredListQueryArgs<
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
export class NotificationDeliveryIssueCount
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

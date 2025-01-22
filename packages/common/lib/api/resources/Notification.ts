import { GraphQLURL } from "graphql-scalars";
import type { DateTime } from "luxon";
import { Field, ObjectType } from "type-graphql";

import { AccessControlAuthorized } from "../../authorization/AccessControlParam.js";
import { createNodeClasses, Node } from "../relay.js";
import { DateTimeScalar } from "../scalars/DateTimeISO.js";
import type { GlobalId } from "../scalars/GlobalId.js";
import { GlobalIdScalar } from "../scalars/GlobalId.js";
import { TimestampedResource } from "./Resource.js";

@ObjectType({
  implements: [Node],
})
export class NotificationNode extends TimestampedResource implements Node {
  @Field(() => GlobalIdScalar)
  id!: GlobalId;

  @Field(() => String)
  title!: string;

  @Field(() => String)
  body!: string;

  @Field(() => GraphQLURL, { nullable: true })
  url?: URL | undefined | null;

  @Field(() => String, { nullable: true })
  @AccessControlAuthorized(
    "get",
    ["every", "NotificationNode"],
    ".deliveryIssue"
  )
  deliveryIssue?: string | undefined | null;

  @Field(() => DateTimeScalar, { nullable: true })
  @AccessControlAuthorized(
    "get",

    ["every", "NotificationNode"],
    ".deliveryIssueAcknowledgedAt"
  )
  deliveryIssueAcknowledgedAt?: DateTime | undefined | null;

  @Field(() => DateTimeScalar, {
    nullable: true,
    description:
      "The time the notification is scheduled to be sent, if null it is either already sent or unscheduled.",
  })
  sendAt?: DateTime | undefined | null;

  @Field(() => DateTimeScalar, {
    nullable: true,
    description: "The time the server started sending the notification.",
  })
  startedSendingAt?: DateTime | undefined | null;

  public getUniqueId(): string {
    return this.id.id;
  }

  public static init(init: {
    id: string;
    title: string;
    body: string;
    url?: URL | undefined | null;
    deliveryIssue?: string | undefined | null;
    deliveryIssueAcknowledgedAt?: DateTime | undefined | null;
    sendAt?: DateTime | undefined | null;
    startedSendingAt?: DateTime | undefined | null;
    createdAt: DateTime;
    updatedAt: DateTime;
  }) {
    return NotificationNode.createInstance().withValues(init);
  }
}

export const { NotificationConnection, NotificationEdge, NotificationResult } =
  createNodeClasses(NotificationNode, "Notification");

@ObjectType({
  implements: [Node],
})
export class NotificationDeliveryNode
  extends TimestampedResource
  implements Node
{
  @Field(() => GlobalIdScalar)
  id!: GlobalId;

  @Field(() => DateTimeScalar, {
    nullable: true,
    description:
      "The time the server sent the notification to Expo for delivery.",
  })
  sentAt?: DateTime | undefined | null;

  @Field(() => DateTimeScalar, {
    nullable: true,
    description:
      "The time the server received a delivery receipt from the user.",
  })
  @AccessControlAuthorized(
    "get",
    ["every", "NotificationDeliveryNode"],
    ".receiptCheckedAt"
  )
  receiptCheckedAt?: DateTime | undefined | null;

  @Field(() => String, {
    nullable: true,
    description:
      "A unique identifier corresponding the group of notifications this was sent to Expo with.",
  })
  @AccessControlAuthorized(
    "get",
    ["every", "NotificationDeliveryNode"],
    ".chunkUuid"
  )
  chunkUuid?: string | undefined | null;

  @Field(() => String, {
    nullable: true,
    description:
      "Any error message returned by Expo when sending the notification.",
  })
  @AccessControlAuthorized(
    "get",
    ["every", "NotificationDeliveryNode"],
    ".deliveryError"
  )
  deliveryError?: string | undefined | null;

  public getUniqueId(): string {
    return this.id.id;
  }

  public static init(init: {
    id: string;
    sentAt?: DateTime | undefined | null;
    receiptCheckedAt?: DateTime | undefined | null;
    chunkUuid?: string | undefined | null;
    deliveryError?: string | undefined | null;
    createdAt: DateTime;
    updatedAt: DateTime;
  }) {
    return NotificationDeliveryNode.createInstance().withValues(init);
  }
}

export const {
  NotificationDeliveryConnection,
  NotificationDeliveryEdge,
  NotificationDeliveryResult,
} = createNodeClasses(NotificationDeliveryNode, "NotificationDelivery");

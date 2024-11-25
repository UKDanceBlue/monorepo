import { DateTimeISOResolver, URLResolver } from "graphql-scalars";
import type { DateTime } from "luxon";
import { Field, ObjectType } from "type-graphql";

import { AccessControlAuthorized } from "../../authorization/accessControl.js";
import { AccessLevel } from "../../authorization/structures.js";
import { dateTimeFromSomething } from "../../utility/time/intervalTools.js";
import { createNodeClasses, Node } from "../relay.js";
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

  @Field(() => URLResolver, { nullable: true })
  url?: URL | undefined | null;

  @Field(() => String, { nullable: true })
  @AccessControlAuthorized({
    accessLevel: AccessLevel.CommitteeChairOrCoordinator,
  })
  deliveryIssue?: string | undefined | null;

  @Field(() => DateTimeISOResolver, { nullable: true })
  @AccessControlAuthorized({
    accessLevel: AccessLevel.CommitteeChairOrCoordinator,
  })
  deliveryIssueAcknowledgedAt?: Date | undefined | null;
  get deliveryIssueAcknowledgedAtDateTime(): DateTime | null {
    return dateTimeFromSomething(this.deliveryIssueAcknowledgedAt ?? null);
  }

  @Field(() => DateTimeISOResolver, {
    nullable: true,
    description:
      "The time the notification is scheduled to be sent, if null it is either already sent or unscheduled.",
  })
  sendAt?: Date | undefined | null;
  get sendAtDateTime(): DateTime | null {
    return dateTimeFromSomething(this.sendAt ?? null);
  }

  @Field(() => DateTimeISOResolver, {
    nullable: true,
    description: "The time the server started sending the notification.",
  })
  startedSendingAt?: Date | undefined | null;
  get startedSendingAtDateTime(): DateTime | null {
    return dateTimeFromSomething(this.startedSendingAt ?? null);
  }

  public getUniqueId(): string {
    return this.id.id;
  }

  public static init(init: {
    id: string;
    title: string;
    body: string;
    url?: URL | undefined | null;
    deliveryIssue?: string | undefined | null;
    deliveryIssueAcknowledgedAt?: Date | undefined | null;
    sendAt?: Date | undefined | null;
    startedSendingAt?: Date | undefined | null;
    createdAt: Date;
    updatedAt: Date;
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

  @Field(() => Date, {
    nullable: true,
    description:
      "The time the server sent the notification to Expo for delivery.",
  })
  sentAt?: Date | undefined | null;

  @Field(() => Date, {
    nullable: true,
    description:
      "The time the server received a delivery receipt from the user.",
  })
  @AccessControlAuthorized({
    accessLevel: AccessLevel.CommitteeChairOrCoordinator,
  })
  receiptCheckedAt?: Date | undefined | null;

  @Field(() => String, {
    nullable: true,
    description:
      "A unique identifier corresponding the group of notifications this was sent to Expo with.",
  })
  @AccessControlAuthorized({
    accessLevel: AccessLevel.CommitteeChairOrCoordinator,
  })
  chunkUuid?: string | undefined | null;

  @Field(() => String, {
    nullable: true,
    description:
      "Any error message returned by Expo when sending the notification.",
  })
  @AccessControlAuthorized({
    accessLevel: AccessLevel.CommitteeChairOrCoordinator,
  })
  deliveryError?: string | undefined | null;

  public getUniqueId(): string {
    return this.id.id;
  }

  public static init(init: {
    id: string;
    sentAt?: Date | undefined | null;
    receiptCheckedAt?: Date | undefined | null;
    chunkUuid?: string | undefined | null;
    deliveryError?: string | undefined | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return NotificationDeliveryNode.createInstance().withValues(init);
  }
}

export const {
  NotificationDeliveryConnection,
  NotificationDeliveryEdge,
  NotificationDeliveryResult,
} = createNodeClasses(NotificationDeliveryNode, "NotificationDelivery");

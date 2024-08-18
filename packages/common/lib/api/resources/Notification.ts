import { TimestampedResource } from "./Resource.js";

import { AccessControl } from "../../authorization/accessControl.js";
import { AccessLevel } from "../../authorization/structures.js";
import { dateTimeFromSomething } from "../../utility/time/intervalTools.js";
import { Node, createNodeClasses } from "../relay.js";
import { GlobalIdScalar } from "../scalars/GlobalId.js";

import { DateTimeISOResolver, URLResolver } from "graphql-scalars";
import { Field, ObjectType } from "type-graphql";

import type { GlobalId } from "../scalars/GlobalId.js";
import type { DateTime } from "luxon";

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
  url?: URL | null;

  @Field(() => String, { nullable: true })
  @AccessControl({ accessLevel: AccessLevel.CommitteeChairOrCoordinator })
  deliveryIssue?: string | null;

  @Field(() => DateTimeISOResolver, { nullable: true })
  @AccessControl({ accessLevel: AccessLevel.CommitteeChairOrCoordinator })
  deliveryIssueAcknowledgedAt?: Date | null;
  get deliveryIssueAcknowledgedAtDateTime(): DateTime | null {
    return dateTimeFromSomething(this.deliveryIssueAcknowledgedAt ?? null);
  }

  @Field(() => DateTimeISOResolver, {
    nullable: true,
    description:
      "The time the notification is scheduled to be sent, if null it is either already sent or unscheduled.",
  })
  sendAt?: Date | null;
  get sendAtDateTime(): DateTime | null {
    return dateTimeFromSomething(this.sendAt ?? null);
  }

  @Field(() => DateTimeISOResolver, {
    nullable: true,
    description: "The time the server started sending the notification.",
  })
  startedSendingAt?: Date | null;
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
    url?: URL | null;
    deliveryIssue?: string | null;
    deliveryIssueAcknowledgedAt?: Date | null;
    sendAt?: Date | null;
    startedSendingAt?: Date | null;
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
  sentAt?: Date | null;

  @Field(() => Date, {
    nullable: true,
    description:
      "The time the server received a delivery receipt from the user.",
  })
  @AccessControl({ accessLevel: AccessLevel.CommitteeChairOrCoordinator })
  receiptCheckedAt?: Date | null;

  @Field(() => String, {
    nullable: true,
    description:
      "A unique identifier corresponding the group of notifications this was sent to Expo with.",
  })
  @AccessControl({ accessLevel: AccessLevel.CommitteeChairOrCoordinator })
  chunkUuid?: string | null;

  @Field(() => String, {
    nullable: true,
    description:
      "Any error message returned by Expo when sending the notification.",
  })
  @AccessControl({ accessLevel: AccessLevel.CommitteeChairOrCoordinator })
  deliveryError?: string | null;

  public getUniqueId(): string {
    return this.id.id;
  }

  public static init(init: {
    id: string;
    sentAt?: Date | null;
    receiptCheckedAt?: Date | null;
    chunkUuid?: string | null;
    deliveryError?: string | null;
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

import type { Notification, Prisma } from "@prisma/client";
import type { TeamType } from "@ukdanceblue/common";
import { ConcreteError } from "@ukdanceblue/common/error";
import { AsyncResult } from "ts-results-es";

export interface SendableNotification {
  title: string;
  body: string;
  url?: URL;
}

export type NotificationAudience = "all" | NotificationAudienceFilter;

export interface NotificationAudienceFilter {
  memberOfTeamType?: TeamType;
  memberOfTeamIds?: string[];
  personIds?: string[];
}

export interface NotificationProvider {
  /**
   * Create a notification in the database, but takes no action on sending it.
   *
   * @param sendable The content of the notification
   * @param audience The audience for the notification
   */
  makeNotification(
    sendable: SendableNotification,
    audience: NotificationAudience
  ): AsyncResult<Notification, ConcreteError>;

  /**
   * Sends a pre-existing notification, if it has not already been sent.
   *
   * @param notification A selector for the notification to send
   */
  sendNotification(
    notification:
      | {
          where: Prisma.NotificationWhereUniqueInput;
        }
      | {
          value: Notification;
        }
  ): AsyncResult<void, ConcreteError>;
}

import type { Notification, Prisma } from "@prisma/client";
import type { TeamType } from "@ukdanceblue/common";
import type { ConcreteError } from "@ukdanceblue/common/error";
import type { AsyncResult } from "ts-results-es";

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
console.log(
  "This page allows you to create a notification. The outline of the notification will be presented at the top of the page and who it will go to. You can send this to a specific person or group of people or everyone. After clicking create you will go to the “notification overview” page. On this page you will then click manage delivery. This is where you will schedule the notification or just send the notification."
);
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

import type { Notification, Prisma } from "@prisma/client";

export interface SendableNotification {
  title: string;
  body: string;
  url?: URL;
}

export type NotificationAudience = "all" | NotificationAudienceFilter;

export interface NotificationAudienceFilter {
  committeeOnly?: boolean;
  memberOfTeamUuid?: string;
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
  ): Promise<Notification>;

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
  ): Promise<void>;
}

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
  sendNotification(
    sendable: SendableNotification,
    audience: NotificationAudience
  ): Promise<void>;
}

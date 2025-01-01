import type { Notification } from "@prisma/client";
import { NotificationNode } from "@ukdanceblue/common";
import { DateTime } from "luxon";

export function notificationModelToResource(
  notificationModel: Notification
): NotificationNode {
  return NotificationNode.init({
    id: notificationModel.uuid,
    title: notificationModel.title,
    body: notificationModel.body,
    url: notificationModel.url ? new URL(notificationModel.url) : null,
    deliveryIssue: notificationModel.deliveryIssue,
    deliveryIssueAcknowledgedAt:
      notificationModel.deliveryIssueAcknowledgedAt &&
      DateTime.fromJSDate(notificationModel.deliveryIssueAcknowledgedAt),
    sendAt:
      notificationModel.sendAt && DateTime.fromJSDate(notificationModel.sendAt),
    startedSendingAt:
      notificationModel.startedSendingAt &&
      DateTime.fromJSDate(notificationModel.startedSendingAt),
    createdAt: DateTime.fromJSDate(notificationModel.createdAt),
    updatedAt: DateTime.fromJSDate(notificationModel.updatedAt),
  });
}

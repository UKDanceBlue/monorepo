import type { Notification } from "@prisma/client";
import { NotificationNode } from "@ukdanceblue/common";

export function notificationModelToResource(
  notificationModel: Notification
): NotificationNode {
  return NotificationNode.init({
    id: notificationModel.uuid,
    title: notificationModel.title,
    body: notificationModel.body,
    url: notificationModel.url ? new URL(notificationModel.url) : null,
    deliveryIssue: notificationModel.deliveryIssue,
    deliveryIssueAcknowledgedAt: notificationModel.deliveryIssueAcknowledgedAt,
    sendAt: notificationModel.sendAt,
    startedSendingAt: notificationModel.startedSendingAt,
    createdAt: notificationModel.createdAt,
    updatedAt: notificationModel.updatedAt,
  });
}

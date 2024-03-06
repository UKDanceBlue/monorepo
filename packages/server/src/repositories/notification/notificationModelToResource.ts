import type { Notification } from "@prisma/client";
import { NotificationResource } from "@ukdanceblue/common";

export function notificationModelToResource(
  notificationModel: Notification
): NotificationResource {
  return NotificationResource.init({
    uuid: notificationModel.uuid,
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

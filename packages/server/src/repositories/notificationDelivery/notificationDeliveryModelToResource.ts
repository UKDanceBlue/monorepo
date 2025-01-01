import type { NotificationDelivery } from "@prisma/client";
import { NotificationDeliveryNode } from "@ukdanceblue/common";
import { DateTime } from "luxon";

export function notificationDeliveryModelToResource(
  notificationDeliveryModel: NotificationDelivery
): NotificationDeliveryNode {
  return NotificationDeliveryNode.init({
    id: notificationDeliveryModel.uuid,
    sentAt:
      notificationDeliveryModel.sentAt &&
      DateTime.fromJSDate(notificationDeliveryModel.sentAt),
    receiptCheckedAt:
      notificationDeliveryModel.receiptCheckedAt &&
      DateTime.fromJSDate(notificationDeliveryModel.receiptCheckedAt),
    chunkUuid: notificationDeliveryModel.chunkUuid,
    deliveryError: notificationDeliveryModel.deliveryError,
    createdAt: DateTime.fromJSDate(notificationDeliveryModel.createdAt),
    updatedAt: DateTime.fromJSDate(notificationDeliveryModel.updatedAt),
  });
}

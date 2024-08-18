import { NotificationDeliveryNode } from "@ukdanceblue/common";

import type { NotificationDelivery } from "@prisma/client";

export function notificationDeliveryModelToResource(
  notificationDeliveryModel: NotificationDelivery
): NotificationDeliveryNode {
  return NotificationDeliveryNode.init({
    id: notificationDeliveryModel.uuid,
    sentAt: notificationDeliveryModel.sentAt,
    receiptCheckedAt: notificationDeliveryModel.receiptCheckedAt,
    chunkUuid: notificationDeliveryModel.chunkUuid,
    deliveryError: notificationDeliveryModel.deliveryError,
    createdAt: notificationDeliveryModel.createdAt,
    updatedAt: notificationDeliveryModel.updatedAt,
  });
}

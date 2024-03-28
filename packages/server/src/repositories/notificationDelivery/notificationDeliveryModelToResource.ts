import type { NotificationDelivery } from "@prisma/client";
import { NotificationDeliveryResource } from "@ukdanceblue/common";

export function notificationDeliveryModelToResource(
  notificationDeliveryModel: NotificationDelivery
): NotificationDeliveryResource {
  return NotificationDeliveryResource.init({
    uuid: notificationDeliveryModel.uuid,
    sentAt: notificationDeliveryModel.sentAt,
    receiptCheckedAt: notificationDeliveryModel.receiptCheckedAt,
    chunkUuid: notificationDeliveryModel.chunkUuid,
    deliveryError: notificationDeliveryModel.deliveryError,
    createdAt: notificationDeliveryModel.createdAt,
    updatedAt: notificationDeliveryModel.updatedAt,
  });
}

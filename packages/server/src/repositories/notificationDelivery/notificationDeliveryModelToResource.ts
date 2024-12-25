import { NotificationDeliveryNode } from "@ukdanceblue/common";

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

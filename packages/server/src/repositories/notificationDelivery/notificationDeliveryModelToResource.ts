import type { NotificationDelivery } from "@prisma/client";
import { NotificationDeliveryResource } from "@ukdanceblue/common";

export function notificationDeliveryModelToResource(
  notificationDeliveryModel: NotificationDelivery
): NotificationDeliveryResource {
  return NotificationDeliveryResource.init({
    uuid: notificationDeliveryModel.uuid,
    deliveredBy: notificationDeliveryModel.deliveredBy,
    chunkUuid: notificationDeliveryModel.chunkUuid,
    deliveryError: notificationDeliveryModel.deliveryError,
    createdAt: notificationDeliveryModel.createdAt,
    updatedAt: notificationDeliveryModel.updatedAt,
  });
}

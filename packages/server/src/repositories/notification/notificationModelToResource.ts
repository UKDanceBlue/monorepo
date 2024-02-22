import type { Notification } from "@prisma/client";
import { NotificationResource } from "@ukdanceblue/common";

export function notificationModelToResource(notificationModel: Notification): NotificationResource {
  return NotificationResource.init({
    uuid: notificationModel.uuid,
  });
}

// We allow awaits in loops here because we actually do want to slow down processing
/* eslint-disable no-await-in-loop */
import { randomUUID } from "crypto";

import type { Notification, Prisma } from "@prisma/client";
import { DetailedError, ErrorCode } from "@ukdanceblue/common";
import type { ExpoPushMessage, ExpoPushTicket } from "expo-server-sdk";
import { Expo } from "expo-server-sdk";
import { DateTime } from "luxon";
import { Service } from "typedi";

import type {
  NotificationAudience,
  NotificationProvider,
  SendableNotification,
} from "./NotificationProvider.js";
import { isDevelopment } from "#environment";
import { logger } from "#logging/standardLogging.js";
import { DeviceRepository } from "#repositories/device/DeviceRepository.js";
import { NotificationRepository } from "#repositories/notification/NotificationRepository.js";
import { NotificationDeliveryRepository } from "#repositories/notificationDelivery/NotificationDeliveryRepository.js";

function makeExpoNotifications(
  content: {
    title: string;
    body: string;
    url?: string | undefined | null;
  },
  deliveries: {
    uuid: string;
    device: {
      id: number;
      expoPushToken: string | null;
    };
  }[]
): ExpoPushMessage[] {
  const messages: ExpoPushMessage[] = [];

  for (const delivery of deliveries) {
    if (delivery.device.expoPushToken) {
      messages.push({
        to: delivery.device.expoPushToken,
        title: content.title,
        body: content.body,
        data: {
          url: content.url ? encodeURI(content.url) : null,
          notificationDeliveryUuid: delivery.uuid,
        },
      });
    }
  }

  return messages;
}

@Service()
export class ExpoNotificationProvider implements NotificationProvider {
  constructor(
    protected notificationRepository: NotificationRepository,
    protected notificationDeliveryRepository: NotificationDeliveryRepository,
    protected deviceRepository: DeviceRepository,
    protected expoSdk: Expo
  ) {}

  protected async prepareNotification(sendable: SendableNotification) {
    const databaseNotification =
      await this.notificationRepository.createNotification({
        title: sendable.title,
        body: sendable.body,
        url: sendable.url?.href,
      });

    return databaseNotification;
  }

  protected async makeNotificationDeliveryRows(
    databaseNotification: { id: number },
    devices: { id: number }[]
  ) {
    return this.notificationDeliveryRepository.createNotificationDeliveries({
      deviceIds: devices.map((device) => device.id),
      notificationId: databaseNotification.id,
    });
  }

  protected async handleDeviceNotRegistered(deliveryUuid: string) {
    // The device cannot receive push notifications anymore and you should stop sending messages to the corresponding Expo push token.
    const device =
      await this.notificationDeliveryRepository.findDeviceForDelivery({
        uuid: deliveryUuid,
      });
    if (device) {
      await this.deviceRepository.unsubscribeFromNotifications({
        id: device.id,
      });
    }
  }

  public makeNotification(
    sendable: SendableNotification,
    audience: NotificationAudience
  ) {
    logger.info("Preparing a notification", {
      sendable,
      audience,
    });

    return this.addNotificationToDatabase(sendable, audience);
  }

  public async sendNotification(
    notification:
      | {
          where: Prisma.NotificationWhereUniqueInput;
        }
      | {
          value: Notification;
        }
  ) {
    const databaseNotification =
      await this.notificationRepository.findNotificationByUnique(
        "where" in notification
          ? notification.where
          : { id: notification.value.id }
      );

    if (databaseNotification == null) {
      throw new DetailedError(
        ErrorCode.InvalidRequest,
        "Notification not found"
      );
    }

    if (databaseNotification.startedSendingAt != null) {
      throw new DetailedError(
        ErrorCode.InvalidRequest,
        "Notification has already been sent."
      );
    }

    await this.notificationRepository.updateNotification(
      { id: databaseNotification.id },
      { startedSendingAt: new Date() }
    );

    try {
      const result =
        await this.completeNotificationDelivery(databaseNotification);

      if (result === "NoAction") {
        await this.notificationRepository.updateNotification(
          { id: databaseNotification.id },
          { startedSendingAt: null }
        );
      }

      if (result === "AllSent") {
        logger.info("Notification sent", {
          notificationUuid: databaseNotification.uuid,
        });
      }

      if (result === "SomeFailed") {
        logger.warning("Notification partially sent", {
          notificationUuid: databaseNotification.uuid,
        });
      }

      if (result === "AllFailed") {
        logger.error("Notification failed to send", {
          notificationUuid: databaseNotification.uuid,
        });
      }
    } catch (error) {
      logger.error("Error sending notification", { error });
    }
  }

  /**
   * Create a notification in the database, finds the devices to send it to, and creates the delivery rows.
   */
  private async addNotificationToDatabase(
    sendable: SendableNotification,
    audience: NotificationAudience
  ) {
    // Lifecycle step 2
    const databaseNotification = await this.prepareNotification(sendable);

    try {
      // Lifecycle step 3
      const devices =
        await this.deviceRepository.lookupNotificationAudience(audience);

      // Lifecycle step 4
      await this.makeNotificationDeliveryRows(databaseNotification, devices);
    } catch (error) {
      // If anything fails up to this point we can cleanly delete the notification
      // as nothing has actually been sent to Expo servers yet
      await this.notificationRepository.deleteNotification({
        id: databaseNotification.id,
      });
      throw error;
    }
    return databaseNotification;
  }

  /**
   * Send the notification to Expo and update the database with the results.
   */
  private async completeNotificationDelivery(
    databaseNotification: Notification
  ): Promise<"AllSent" | "SomeFailed" | "AllFailed" | "NoAction"> {
    const tickets: [ExpoPushTicket, deliveryUuid: string][] = [];

    let deliveryRows: {
      uuid: string;
      device: {
        id: number;
        expoPushToken: string | null;
      };
    }[];
    try {
      deliveryRows =
        await this.notificationRepository.findDeliveriesForNotification({
          id: databaseNotification.id,
        });
    } catch (error) {
      logger.error("Error finding notification deliveries", { error });
      return "NoAction";
    }

    if (isDevelopment && deliveryRows.length > 10) {
      await this.notificationRepository.updateNotification(
        { id: databaseNotification.id },
        {
          deliveryIssue:
            "FAILSAFE TRIGGERED: you are in a development environment and trying to send a notification to more than 10 devices. This is likely a mistake.",
          sendAt: null,
        }
      );
      return "NoAction";
    }

    // Lifecycle step 5
    let chunks: readonly ExpoPushMessage[][];
    try {
      const messages: ExpoPushMessage[] = makeExpoNotifications(
        {
          body: databaseNotification.body,
          title: databaseNotification.title,
          url: databaseNotification.url,
        },
        deliveryRows
      );
      chunks = this.expoSdk.chunkPushNotifications(messages);
    } catch (error) {
      logger.error("Error chunking notifications", { error });
      return "NoAction";
    }

    // Remove the sendAt date so that the notification is not sent again
    try {
      await this.notificationRepository.updateNotification(
        { id: databaseNotification.id },
        { sendAt: null }
      );
    } catch (error) {
      logger.error("Error clearing sendAt date on notification", { error });
      return "NoAction";
    }

    // BEGIN DANGER ZONE

    let fullSuccess = true;

    for (const chunk of chunks) {
      const ticketChunk: [ExpoPushTicket, deliveryUuid: string][] = [];
      try {
        // Lifecycle step 6
        const rawTicketChunk =
          await this.expoSdk.sendPushNotificationsAsync(chunk);
        for (let i = 0; i < chunk.length; i++) {
          const notificationData = chunk[i]!.data;
          if (
            notificationData &&
            "notificationDeliveryUuid" in notificationData &&
            typeof notificationData.notificationDeliveryUuid === "string"
          ) {
            ticketChunk.push([
              rawTicketChunk[i]!,
              notificationData.notificationDeliveryUuid,
            ]);
          } else {
            logger.error("Delivery UUID not found in notification data", {
              notificationData,
            });
            fullSuccess = false;
          }
        }
      } catch (error) {
        logger.error("Error sending notification", { error });
        fullSuccess = false;

        if (typeof error === "object" && error) {
          let errorString = "Unknown error";
          if ("code" in error) {
            // This is probably an Expo server error
            errorString = `Expo server error: ${String(error.code)}`;
          }
          if ("message" in error) {
            errorString += ` - ${String(error.message)}`;
          }
          await this.notificationRepository.updateNotification(
            { id: databaseNotification.id },
            { deliveryIssue: errorString }
          );
        }

        continue;
      }

      // Lifecycle step 7,8
      try {
        await this.notificationDeliveryRepository.updateTicketChunk({
          chunkUuid: randomUUID(),
          tickets: ticketChunk.map(([ticket, deliveryUuid]) => ({
            ticket,
            deliveryUuid,
          })),
          sentAt: DateTime.utc(),
        });
        tickets.push(...ticketChunk);
      } catch (error) {
        logger.error("Error updating notification delivery", { error });
        fullSuccess = false;
      }
    }

    // END DANGER ZONE

    // Lifecycle step 9
    try {
      await Promise.all(
        tickets.map((ticket) => {
          return ticket[0].status === "error" &&
            ticket[0].details?.error === "DeviceNotRegistered"
            ? this.handleDeviceNotRegistered(ticket[1])
            : Promise.resolve();
        })
      );
    } catch (error) {
      logger.error("Error handling device not registered", { error });
    }

    if (fullSuccess) {
      return "AllSent";
    }

    if (tickets.length === 0 && deliveryRows.length > 0) {
      return "AllFailed";
    }

    return "SomeFailed";
  }
}

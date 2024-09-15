// We allow awaits in loops here because we actually do want to slow down processing

import { isDevelopment } from "#environment";

import { logger } from "#logging/standardLogging.js";
import { DeviceRepository } from "#repositories/device/DeviceRepository.js";
import { NotificationRepository } from "#repositories/notification/NotificationRepository.js";
import { NotificationDeliveryRepository } from "#repositories/notificationDelivery/NotificationDeliveryRepository.js";

import { Expo } from "expo-server-sdk";
import { DateTime } from "luxon";
import { Service } from "@freshgum/typedi";

import { randomUUID } from "crypto";

import type {
  NotificationAudience,
  NotificationProvider,
  SendableNotification,
} from "./NotificationProvider.js";
import type { Notification, Prisma } from "@prisma/client";
import type {
  ExpoPushErrorTicket,
  ExpoPushMessage,
  ExpoPushSuccessTicket,
  ExpoPushTicket,
} from "expo-server-sdk";
import { expoServiceToken } from "./expoServiceToken.js";
import {
  ActionDeniedError,
  CompositeError,
  InvariantError,
  NotFoundError,
  toBasicError,
  UnknownError,
} from "@ukdanceblue/common/error";
import { AsyncResult, Err, Ok, Result } from "ts-results-es";
import { ExpoPushFailureError, ExpoPushTicketError } from "#error/expo.js";
import {
  handleRepositoryError,
  RepositoryError,
} from "#repositories/shared.js";

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

@Service([
  NotificationRepository,
  NotificationDeliveryRepository,
  DeviceRepository,
  expoServiceToken,
])
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
    try {
      logger.info("Preparing a notification", {
        sendable,
        audience,
      });

      return new AsyncResult(
        this.addNotificationToDatabase(sendable, audience)
      );
    } catch (error) {
      logger.error("Error preparing notification", { error });
      return Err(toBasicError(error)).toAsyncResult();
    }
  }

  public sendNotification(
    notification:
      | {
          where: Prisma.NotificationWhereUniqueInput;
        }
      | {
          value: Notification;
        }
  ): AsyncResult<
    void,
    | CompositeError<ExpoPushTicketError>
    | ExpoPushFailureError
    | RepositoryError
    | ActionDeniedError
    | InvariantError
  > {
    return this.notificationRepository
      .findNotificationByUnique(
        "where" in notification
          ? notification.where
          : { id: notification.value.id }
      )
      .andThen(
        (
          databaseNotification
        ): AsyncResult<Notification, RepositoryError | InvariantError> => {
          if (databaseNotification == null) {
            return Err(
              new NotFoundError({ what: "Notification" })
            ).toAsyncResult();
          }

          if (databaseNotification.startedSendingAt != null) {
            return Err(
              new InvariantError("Notification has already been sent")
            ).toAsyncResult();
          }

          return this.notificationRepository.updateNotification(
            { id: databaseNotification.id },
            { startedSendingAt: new Date() }
          );
        }
      )
      .andThen((databaseNotification) => {
        return new AsyncResult(
          this.completeNotificationDelivery(databaseNotification)
        );
      });
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
      return handleRepositoryError(error);
    }
    return Ok(databaseNotification);
  }

  /**
   * Send the notification to Expo and update the database with the results.
   */
  private async completeNotificationDelivery(
    databaseNotification: Notification
  ): Promise<
    Result<
      void,
      | CompositeError<ExpoPushTicketError>
      | ExpoPushFailureError
      | RepositoryError
      | ActionDeniedError
    >
  > {
    const deliveryRows: Result<
      {
        uuid: string;
        device: {
          id: number;
          expoPushToken: string | null;
        };
      }[],
      RepositoryError
    > = await this.notificationRepository.findDeliveriesForNotification({
      id: databaseNotification.id,
    });
    if (deliveryRows.isErr()) {
      return deliveryRows;
    }

    if (isDevelopment && deliveryRows.value.length > 12) {
      try {
        await this.notificationRepository.updateNotification(
          { id: databaseNotification.id },
          {
            deliveryIssue:
              "FAILSAFE TRIGGERED: you are in a development environment and trying to send a notification to more than 12 devices. This is likely a mistake.",
            sendAt: null,
          }
        );
      } finally {
        return Err(
          new ActionDeniedError(
            "FAILSAFE TRIGGERED: you are in a development environment and trying to send a notification to more than 12 devices. This is likely a mistake."
          )
        );
      }
    }

    let chunks: ExpoPushMessage[][] = [];
    try {
      const messages: ExpoPushMessage[] = makeExpoNotifications(
        {
          body: databaseNotification.body,
          title: databaseNotification.title,
          url: databaseNotification.url,
        },
        deliveryRows.value
      );
      chunks = this.expoSdk.chunkPushNotifications(messages);
    } catch (error) {
      return Err(toBasicError(error));
    }

    // Remove the sendAt date so that the notification is not sent again
    const updateNotificationResult =
      await this.notificationRepository.updateNotification(
        { id: databaseNotification.id },
        { sendAt: null }
      ).promise;
    if (updateNotificationResult.isErr()) {
      return updateNotificationResult;
    }

    // BEGIN DANGER ZONE

    let fullSuccess = true;

    const successfulTickets: [ExpoPushSuccessTicket, deliveryUuid: string][] =
      [];
    const failedTickets: [ExpoPushErrorTicket, deliveryUuid: string][] = [];

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
        for (const [ticket, deliveryUuid] of ticketChunk) {
          if (ticket.status === "error") {
            failedTickets.push([ticket, deliveryUuid]);
          } else {
            successfulTickets.push([ticket, deliveryUuid]);
          }
        }
      } catch (error) {
        logger.error("Error updating notification delivery", { error });
        fullSuccess = false;
      }
    }

    // END DANGER ZONE

    // Lifecycle step 9
    try {
      await Promise.all(
        failedTickets.map(([ticket, deliveryUuid]) => {
          return ticket.details?.error === "DeviceNotRegistered"
            ? this.handleDeviceNotRegistered(deliveryUuid)
            : Promise.resolve();
        })
      );
    } catch (error) {
      logger.error("Error handling device not registered", { error });
    }

    if (fullSuccess) {
      return Ok(undefined);
    }

    if (
      successfulTickets.length === 0 &&
      failedTickets.length === 0 &&
      deliveryRows.value.length > 0
    ) {
      return Err(new UnknownError("No tickets were returned from Expo"));
    }

    return Err(
      new ExpoPushFailureError(
        "Some notifications failed to send",
        failedTickets.map(([ticket]) => ticket)
      )
    );
  }
}

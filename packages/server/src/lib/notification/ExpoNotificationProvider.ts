import { randomUUID } from "crypto";

import type {
  ExpoPushErrorTicket,
  ExpoPushMessage,
  ExpoPushTicket,
} from "expo-server-sdk";
import { Expo } from "expo-server-sdk";
import { DateTime } from "luxon";
import { Container, Service } from "typedi";

import { expoAccessToken } from "../../environment.js";
import { DeviceRepository } from "../../repositories/device/DeviceRepository.js";
import { NotificationRepository } from "../../repositories/notification/NotificationRepository.js";
import { NotificationDeliveryRepository } from "../../repositories/notificationDelivery/NotificationDeliveryRepository.js";

import type {
  NotificationAudience,
  NotificationProvider,
  SendableNotification,
} from "./NotificationProvider.js";

function makeExpoNotification(
  sendable: SendableNotification
): Omit<ExpoPushMessage, "to"> {
  return {
    title: sendable.title,
    body: sendable.body,
    data: {
      url: sendable.url?.toString(),
    },
  };
}

Container.set(Expo, new Expo({ accessToken: expoAccessToken }));

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

    const expoNotification = makeExpoNotification(sendable);

    return { databaseNotification, expoNotification };
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

  protected async handleErroredTicket(ticket: ExpoPushErrorTicket) {
    // TODO: Handle the errored ticket
  }

  public async sendNotification(
    sendable: SendableNotification,
    audience: NotificationAudience
  ) {
    // Lifecycle step 2
    const { databaseNotification, expoNotification } =
      await this.prepareNotification(sendable);

    // Lifecycle step 3
    const devices =
      await this.deviceRepository.lookupNotificationAudience(audience);

    // Lifecycle step 4
    await this.makeNotificationDeliveryRows(databaseNotification, devices);

    // Lifecycle step 5
    const messages: ExpoPushMessage[] = devices.map((device) => ({
      ...expoNotification,
      to: device.expoPushToken,
    }));

    const chunks = this.expoSdk.chunkPushNotifications(messages);
    const sentChunks: {
      chunkUuid: string;
      tickets: ExpoPushTicket[];
      sentAt: DateTime;
    }[] = [];

    const erroredTickets: ExpoPushErrorTicket[] = [];

    try {
      for (const chunk of chunks) {
        try {
          const ticketChunk =
            // eslint-disable-next-line no-await-in-loop
            await this.expoSdk.sendPushNotificationsAsync(chunk);
          sentChunks.push({
            chunkUuid: randomUUID(),
            tickets: ticketChunk,
            sentAt: DateTime.now(),
          });
        } catch (error) {
          console.error("Error sending notification", error);
        }
      }
    } finally {
      // Lifecycle step 6
      // Store the sent chunks' information in the database and add any errored tickets to the error queue
    }

    // Lifecycle step 7

    // Lifecycle step 8
    await Promise.all(
      erroredTickets.map((ticket) => this.handleErroredTicket(ticket))
    );
  }
}

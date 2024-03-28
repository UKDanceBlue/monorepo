/* eslint-disable no-await-in-loop */
import type { ExpoPushReceipt } from "expo-server-sdk";
import { Expo } from "expo-server-sdk";
import { Service } from "typedi";

import { DeviceRepository } from "../../repositories/device/DeviceRepository.js";
import { NotificationDeliveryRepository } from "../../repositories/notificationDelivery/NotificationDeliveryRepository.js";

@Service()
export class ExpoPushReceiptHandler {
  constructor(
    protected notificationDeliveryRepository: NotificationDeliveryRepository,
    protected deviceRepository: DeviceRepository,
    protected expoSdk: Expo
  ) {}

  public async handlePushReceipts() {
    const deliveries =
      await this.notificationDeliveryRepository.findUncheckedDeliveries();
    const deliveriesByReceiptId = new Map(
      deliveries.map((delivery) => [delivery.receiptId, delivery])
    );

    const chunkedIds = this.expoSdk.chunkPushNotificationReceiptIds(
      deliveries.map((delivery) => delivery.receiptId)
    );

    // A list of devices that need to be unsubscribed from notifications
    const devicesToUnsubscribe: number[] = [];

    for (const chunk of chunkedIds) {
      try {
        const receipts =
          await this.expoSdk.getPushNotificationReceiptsAsync(chunk);
        const updateParam: { receipt: ExpoPushReceipt; deliveryId: number }[] =
          [];
        for (const [receiptId, receipt] of Object.entries(receipts)) {
          const delivery = deliveriesByReceiptId.get(receiptId);
          if (delivery) {
            updateParam.push({ receipt, deliveryId: delivery.id });
          }
          if (
            receipt.status === "error" &&
            receipt.details?.error === "DeviceNotRegistered" &&
            delivery?.device.id
          ) {
            devicesToUnsubscribe.push(delivery.device.id);
          }
        }
        await this.notificationDeliveryRepository.updateReceiptChunk({
          receipts: updateParam,
        });
      } catch (error) {
        console.error("Failed to fetch push receipts", error);
      }
    }

    await Promise.all(
      devicesToUnsubscribe.map((deviceId) =>
        this.deviceRepository.unsubscribeFromNotifications({ id: deviceId })
      )
    );
  }
}

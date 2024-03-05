import type { Notification } from "@prisma/client";
import Cron, { scheduledJobs } from "croner";
import { Inject, Service } from "typedi";

import { logger } from "../lib/logging/standardLogging.js";
import { ExpoNotificationProvider } from "../lib/notification/ExpoNotificationProvider.js";
import * as NotificationProviderJs from "../lib/notification/NotificationProvider.js";
import { NotificationRepository } from "../repositories/notification/NotificationRepository.js";

function scheduleId(notificationUuid: string) {
  return `scheduled-notification:${notificationUuid}`;
}

function makeScheduledJobNamesSet() {
  return new Set(scheduledJobs.map((job) => job.name));
}

@Service()
export class NotificationScheduler {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    @Inject(() => ExpoNotificationProvider)
    private readonly notificationProvider: NotificationProviderJs.NotificationProvider
  ) {
    this.ensureNotificationScheduler();
  }

  public ensureNotificationScheduler() {
    if (
      !scheduledJobs.some((job) => job.name === "check-scheduled-notifications")
    ) {
      // Every three minutes, check for scheduled notifications that need to be sent
      const checkScheduledNotificationsJob = new Cron(
        "0 */3 * * * *",
        {
          name: "check-scheduled-notifications",
          catch: (error) => {
            logger.error("Failed to check for scheduled notifications", error);
          },
        },
        async () => {
          try {
            await this.checkScheduledNotifications();
          } catch (error) {
            logger.error("Failed to check for scheduled notifications", error);
          }
        }
      );

      // On startup, check for any scheduled notifications that need to be sent
      checkScheduledNotificationsJob
        .trigger()
        .catch((error) =>
          logger.error("Failed to check for scheduled notifications", error)
        );
    }
  }

  private async checkScheduledNotifications() {
    logger.debug("Checking for scheduled notifications");

    const scheduledNotifications =
      await this.notificationRepository.findScheduledNotifications();

    logger.debug(
      `Found ${scheduledNotifications.length} scheduled notifications`
    );

    const scheduledJobNames = makeScheduledJobNamesSet();
    const now = new Date();
    const promises: Promise<void>[] = [];
    for (const notification of scheduledNotifications) {
      if (notification.sendAt) {
        if (scheduledJobNames.has(scheduleId(notification.uuid))) {
          continue;
        } else if (notification.sendAt < now) {
          logger.info("Found past-due scheduled notification", {
            notificationUuid: notification.uuid,
          });
          promises.push(
            this.notificationProvider.sendNotification({ value: notification })
          );
        } else {
          logger.info("Scheduling notification", {
            notificationUuid: notification.uuid,
            sendAt: notification.sendAt,
          });
          this.scheduleNotification(notification);
        }
      }
    }
    const results = await Promise.allSettled(promises);
    for (const result of results) {
      if (result.status === "rejected") {
        logger.error("Failed to send scheduled notification", result.reason);
      } else {
        logger.debug("A past-due scheduled notification was sent");
      }
    }
  }

  private scheduleNotification(notification: Notification) {
    if (!notification.sendAt) {
      throw new Error("Notification has no sendAt date, cannot schedule it");
    }

    const jobName = scheduleId(notification.uuid);
    const job = new Cron(
      notification.sendAt,
      {
        maxRuns: 1,
        name: jobName,
        catch: (error) => {
          logger.error("Failed to send scheduled notification", {
            notificationUuid: notification.uuid,
            error,
          });
        },
        protect: true,
      },
      async () => {
        try {
          logger.info("Sending scheduled notification", {
            notificationUuid: notification.uuid,
          });
          await this.notificationProvider.sendNotification({
            value: notification,
          });
        } catch (error) {
          logger.error("Failed to send scheduled notification", {
            notificationUuid: notification.uuid,
            error,
          });
        } finally {
          job.stop();
        }
      }
    );
  }
}

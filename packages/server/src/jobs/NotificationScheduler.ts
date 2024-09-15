import { logger } from "#logging/standardLogging.js";
import { ExpoNotificationProvider } from "#notification/ExpoNotificationProvider.js";
import * as NotificationProviderJs from "#notification/NotificationProvider.js";
import { NotificationRepository } from "#repositories/notification/NotificationRepository.js";

import Cron, { scheduledJobs } from "croner";
import { Service } from "@freshgum/typedi";

import type { Notification } from "@prisma/client";
import { ConcreteResult } from "@ukdanceblue/common/error";

function scheduleId(notificationUuid: string) {
  return `scheduled-notification:${notificationUuid}`;
}

function makeScheduledJobsMap() {
  return new Map(scheduledJobs.map((job) => [job.name, job]));
}

@Service([NotificationRepository, ExpoNotificationProvider])
export class NotificationScheduler {
  constructor(
    private readonly notificationRepository: NotificationRepository,
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
        .catch((error: unknown) =>
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

    const scheduledJobNames = makeScheduledJobsMap();
    const now = new Date();
    const promises: Promise<ConcreteResult<void>>[] = [];
    for (const notification of scheduledNotifications) {
      if (notification.sendAt) {
        const exitingJob = scheduledJobNames.get(scheduleId(notification.uuid));
        if (exitingJob != null) {
          if (exitingJob.nextRun() === notification.sendAt) {
            continue;
          } else {
            logger.info(
              "A notification's sendAt has been updated, rescheduling",
              {
                notificationUuid: notification.uuid,
                oldSendAt: exitingJob.nextRun(),
                newSendAt: notification.sendAt,
              }
            );
            exitingJob.stop();
          }
        }

        if (notification.sendAt < now) {
          logger.info("Found past-due scheduled notification", {
            notificationUuid: notification.uuid,
          });
          promises.push(
            this.notificationProvider.sendNotification({ value: notification })
              .promise
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
          const updatedNotification =
            await this.notificationRepository.findNotificationByUnique({
              uuid: notification.uuid,
            }).promise;
          if (updatedNotification.isErr()) {
            logger.error("Failed to find scheduled notification, not sending", {
              notificationUuid: notification.uuid,
              error: updatedNotification.error,
            });
            return;
          }
          if (!updatedNotification.value) {
            logger.info(
              "Scheduled notification was deleted since it was scheduled, not sending",
              {
                notificationUuid: notification.uuid,
                deletedNotification: {
                  title: notification.title,
                },
              }
            );
            return;
          }
          if (notification.sendAt !== updatedNotification.value.sendAt) {
            logger.info(
              "Scheduled notification was updated since it was scheduled, not sending",
              {
                notificationUuid: notification.uuid,
              }
            );
            return;
          }
          const result = await this.notificationProvider.sendNotification({
            value: notification,
          }).promise;
          if (result.isErr()) {
            logger.error("Failed to send scheduled notification", {
              notificationUuid: notification.uuid,
              error: result.error,
            });
          }
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

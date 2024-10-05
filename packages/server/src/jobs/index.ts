import { NotificationScheduler } from "./NotificationScheduler.js";

import { Container } from "@freshgum/typedi";

import "./fetchPushReceipts.js";
import "./garbageCollectLogins.js";
import "./syncDbFunds.js";
import "./userHousekeeping.js";
import { logger } from "#logging/standardLogging.js";

const scheduler = Container.get(NotificationScheduler);
scheduler.ensureNotificationScheduler();

logger.info("Jobs started");

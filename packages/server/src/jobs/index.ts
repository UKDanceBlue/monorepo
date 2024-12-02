import "./fetchPushReceipts.js";
import "./garbageCollectLogins.js";
import "./syncDbFunds.js";
import "./housekeeping.js";

import { Container } from "@freshgum/typedi";

import { logger } from "#logging/standardLogging.js";

import { NotificationScheduler } from "./NotificationScheduler.js";

const scheduler = Container.get(NotificationScheduler);
scheduler.ensureNotificationScheduler();

logger.info("Jobs started");

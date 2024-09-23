import { NotificationScheduler } from "./NotificationScheduler.js";

import { Container } from "@freshgum/typedi";

import "./fetchPushReceipts.js";
import "./garbageCollectLogins.js";
import "./syncDbFunds.js";
import "./userHousekeeping.js";

const scheduler = Container.get(NotificationScheduler);
scheduler.ensureNotificationScheduler();

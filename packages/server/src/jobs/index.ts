import { Container } from "typedi";

import { NotificationScheduler } from "./NotificationScheduler.js";
import "./fetchPushReceipts.js";
import "./garbageCollectLogins.js";
import "./syncDbFunds.js";

const scheduler = Container.get(NotificationScheduler);
scheduler.ensureNotificationScheduler();

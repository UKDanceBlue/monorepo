import { Container } from "typedi";

import { NotificationScheduler } from "./NotificationScheduler.js";
import { fetchPushReceipts } from "./fetchPushReceipts.js";
import { garbageCollectLoginFlowSessions } from "./garbageCollectLogins.js";

await fetchPushReceipts.trigger();
await garbageCollectLoginFlowSessions.trigger();
const scheduler = Container.get(NotificationScheduler);
scheduler.ensureNotificationScheduler();

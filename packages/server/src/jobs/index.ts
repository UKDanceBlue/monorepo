import { fetchPushReceipts } from "./fetchPushReceipts.js";
import { garbageCollectLoginFlowSessions } from "./garbageCollectLogins.js";

await fetchPushReceipts.trigger();
await garbageCollectLoginFlowSessions.trigger();

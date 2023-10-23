import type { NotificationModel } from "../../models/Notification.js";

// Stub for now
export async function selectAudience(
  _notification: NotificationModel,
  _audience: unknown
): Promise<string[]> {
  // eslint-disable-next-line unicorn/no-useless-promise-resolve-reject
  return Promise.resolve([]);
}

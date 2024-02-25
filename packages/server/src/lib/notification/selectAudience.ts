import type { Notification } from "@prisma/client";

// Stub for now
export async function selectAudience(
  _notification: Notification,
  _audience: unknown
): Promise<string[]> {
  // eslint-disable-next-line unicorn/no-useless-promise-resolve-reject
  return Promise.resolve([]);
}

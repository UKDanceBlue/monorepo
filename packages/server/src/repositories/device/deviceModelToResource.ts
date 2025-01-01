import type { Device } from "@prisma/client";
import { DeviceNode } from "@ukdanceblue/common";
import { DateTime } from "luxon";

export function deviceModelToResource(deviceModel: Device): DeviceNode {
  return DeviceNode.init({
    id: deviceModel.uuid,
    lastLogin:
      deviceModel.lastSeen && DateTime.fromJSDate(deviceModel.lastSeen),
    createdAt: DateTime.fromJSDate(deviceModel.createdAt),
    updatedAt: DateTime.fromJSDate(deviceModel.updatedAt),
  });
}

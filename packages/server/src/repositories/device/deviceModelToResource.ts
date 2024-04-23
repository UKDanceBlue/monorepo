import type { Device } from "@prisma/client";
import { DeviceNode } from "@ukdanceblue/common";

export function deviceModelToResource(deviceModel: Device): DeviceNode {
  return DeviceNode.init({
    uuid: deviceModel.uuid,
    lastLogin: deviceModel.lastSeen,
    createdAt: deviceModel.createdAt,
    updatedAt: deviceModel.updatedAt,
  });
}

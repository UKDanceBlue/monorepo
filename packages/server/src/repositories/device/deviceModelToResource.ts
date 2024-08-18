import { DeviceNode } from "@ukdanceblue/common";

import type { Device } from "@prisma/client";

export function deviceModelToResource(deviceModel: Device): DeviceNode {
  return DeviceNode.init({
    id: deviceModel.uuid,
    lastLogin: deviceModel.lastSeen,
    createdAt: deviceModel.createdAt,
    updatedAt: deviceModel.updatedAt,
  });
}

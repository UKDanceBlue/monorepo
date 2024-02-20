import type { Device } from "@prisma/client";
import { DeviceResource } from "@ukdanceblue/common";
import { DateTime } from "luxon";

export function deviceModelToResource(deviceModel: Device): DeviceResource {
  return DeviceResource.init({
    uuid: deviceModel.uuid,
    expoPushToken: deviceModel.expoPushToken,
    lastLogin: deviceModel.lastLogin
      ? DateTime.fromJSDate(deviceModel.lastLogin)
      : null,
    createdAt: deviceModel.createdAt,
    updatedAt: deviceModel.updatedAt,
  });
}

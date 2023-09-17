import { Token } from "typedi";

import type { DeviceResource } from "../object-types/Device.js";

import type { ServiceInterface } from "./ServiceInterface.js";

export type DeviceServiceInterface = ServiceInterface<DeviceResource>

export const deviceServiceToken = new Token<DeviceServiceInterface>("DeviceService");

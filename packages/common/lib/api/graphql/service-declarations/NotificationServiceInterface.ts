import { Token } from "typedi";

import type { NotificationResource } from "../object-types/Notification.js";

import type { ServiceInterface } from "./ServiceInterface.js";

export type NotificationServiceInterface = ServiceInterface<NotificationResource>

export const notificationServiceToken = new Token<NotificationServiceInterface>("NotificationService");

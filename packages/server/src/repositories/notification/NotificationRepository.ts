
import { PrismaClient } from "@prisma/client";
import type { SortDirection } from "@ukdanceblue/common";
import { Service } from "typedi";

import type { FilterItems } from "../../lib/prisma-utils/gqlFilterToPrismaFilter.js";

import { buildNotificationOrder, buildNotificationWhere } from "./notificationRepositoryUtils.js";

const notificationBooleanKeys = [] as const;
type NotificationBooleanKey = (typeof notificationBooleanKeys)[number];

const notificationDateKeys = ["createdAt", "updatedAt"] as const;
type NotificationDateKey = (typeof notificationDateKeys)[number];

const notificationIsNullKeys = [] as const;
type NotificationIsNullKey = (typeof notificationIsNullKeys)[number];

const notificationNumericKeys = [] as const;
type NotificationNumericKey = (typeof notificationNumericKeys)[number];

const notificationOneOfKeys = [] as const;
type NotificationOneOfKey = (typeof notificationOneOfKeys)[number];

const notificationStringKeys = [] as const;
type NotificationStringKey = (typeof notificationStringKeys)[number];

export type NotificationFilters = FilterItems<
  NotificationBooleanKey,
  NotificationDateKey,
  NotificationIsNullKey,
  NotificationNumericKey,
  NotificationOneOfKey,
  NotificationStringKey
>;

@Service()
export class NotificationRepository {
  constructor(
    private prisma: PrismaClient,
    ) {}
}
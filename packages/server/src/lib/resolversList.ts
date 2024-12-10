import { AuditLogResolver } from "#resolvers/AuditLogResolver.js";
import { ConfigurationResolver } from "#resolvers/ConfigurationResolver.js";
import {
  DailyDepartmentNotificationBatchResolver,
  DailyDepartmentNotificationResolver,
} from "#resolvers/DailyDepartmentNotification.js";
import { DeviceResolver } from "#resolvers/DeviceResolver.js";
import { EventResolver } from "#resolvers/EventResolver.js";
import { FeedResolver } from "#resolvers/FeedResolver.js";
import { FundraisingAssignmentResolver } from "#resolvers/FundraisingAssignmentResolver.js";
import { FundraisingEntryResolver } from "#resolvers/FundraisingEntryResolver.js";
import { ImageResolver } from "#resolvers/ImageResolver.js";
import { LoginStateResolver } from "#resolvers/LoginState.js";
import { MarathonHourResolver } from "#resolvers/MarathonHourResolver.js";
import { MarathonResolver } from "#resolvers/MarathonResolver.js";
import { MembershipResolver } from "#resolvers/MembershipResolver.js";
import { NodeResolver } from "#resolvers/NodeResolver.js";
import {
  NotificationDeliveryResolver,
  NotificationResolver,
} from "#resolvers/NotificationResolver.js";
import { PersonResolver } from "#resolvers/PersonResolver.js";
import { PointEntryResolver } from "#resolvers/PointEntryResolver.js";
import { PointOpportunityResolver } from "#resolvers/PointOpportunityResolver.js";
import { ReportResolver } from "#resolvers/ReportResolver.js";
import { SolicitationCodeResolver } from "#resolvers/SolicitationCodeResolver.js";
import { TeamResolver } from "#resolvers/TeamResolver.js";

export const resolversList = [
  AuditLogResolver,
  ConfigurationResolver,
  DeviceResolver,
  DailyDepartmentNotificationResolver,
  DailyDepartmentNotificationBatchResolver,
  EventResolver,
  ImageResolver,
  PersonResolver,
  MembershipResolver,
  NotificationResolver,
  NotificationDeliveryResolver,
  TeamResolver,
  LoginStateResolver,
  PointEntryResolver,
  PointOpportunityResolver,
  MarathonHourResolver,
  MarathonResolver,
  FeedResolver,
  FundraisingAssignmentResolver,
  FundraisingEntryResolver,
  NodeResolver,
  SolicitationCodeResolver,
  ReportResolver,
] as const;

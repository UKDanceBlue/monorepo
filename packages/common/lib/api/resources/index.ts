import { CommitteeNode } from "./Committee.js";
import { ConfigurationNode } from "./Configuration.js";
import { DailyDepartmentNotificationNode } from "./DailyDepartmentNotification.js";
import { DeviceNode } from "./Device.js";
import { EventNode } from "./Event.js";
import { FeedNode } from "./Feed.js";
import {
  FundraisingAssignmentNode,
  FundraisingEntryNode,
} from "./Fundraising.js";
import { ImageNode } from "./Image.js";
import { MarathonNode } from "./Marathon.js";
import { MarathonHourNode } from "./MarathonHour.js";
import { MembershipNode } from "./Membership.js";
import { NotificationDeliveryNode, NotificationNode } from "./Notification.js";
import { PersonNode } from "./Person.js";
import { PointEntryNode } from "./PointEntry.js";
import { PointOpportunityNode } from "./PointOpportunity.js";
import { SolicitationCodeNode } from "./SolicitationCode.js";
import { TeamNode } from "./Team.js";

export {
  Connection,
  Edge,
  Node,
  PageInfo,
  Resource,
  Result,
} from "../relay.js";
export * from "../resourceError.js";
export * from "../scalars/GlobalId.js";
export * from "../scalars/Void.js";
export { AuthIdPairResource as AuthIdPairNode } from "../types/AuthIdPair.js";
export { EffectiveCommitteeRole } from "../types/EffectiveCommitteeRole.js";
export { IntervalISO } from "../types/IntervalISO.js";
export * from "./Committee.js";
export * from "./Configuration.js";
export * from "./DailyDepartmentNotification.js";
export * from "./Device.js";
export * from "./Event.js";
export * from "./Feed.js";
export * from "./Fundraising.js";
export * from "./Image.js";
export * from "./Marathon.js";
export * from "./MarathonHour.js";
export * from "./Membership.js";
export * from "./Notification.js";
export * from "./Person.js";
export * from "./PointEntry.js";
export * from "./PointOpportunity.js";
export * from "./Resource.js";
export * from "./SolicitationCode.js";
export * from "./Team.js";

export const ResourceClasses = {
  CommitteeNode,
  ConfigurationNode,
  DailyDepartmentNotificationNode,
  DeviceNode,
  EventNode,
  FeedNode,
  FundraisingAssignmentNode,
  FundraisingEntryNode,
  ImageNode,
  MarathonNode,
  MarathonHourNode,
  MembershipNode,
  NotificationNode,
  NotificationDeliveryNode,
  PersonNode,
  PointEntryNode,
  PointOpportunityNode,
  SolicitationCodeNode,
  TeamNode,
} as const;
export type ResourceClasses =
  (typeof ResourceClasses)[keyof typeof ResourceClasses];

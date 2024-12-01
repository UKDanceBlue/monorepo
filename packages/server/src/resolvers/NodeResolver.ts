import { Service } from "@freshgum/typedi";
import type { GlobalId } from "@ukdanceblue/common";
import {
  ConfigurationNode,
  DailyDepartmentNotificationBatchNode,
  DailyDepartmentNotificationNode,
  DeviceNode,
  EventNode,
  FundraisingAssignmentNode,
  FundraisingEntryNode,
  GlobalIdScalar,
  ImageNode,
  MarathonHourNode,
  MarathonNode,
  Node,
  NotificationNode,
  PersonNode,
  PointEntryNode,
  PointOpportunityNode,
  SolicitationCodeNode,
  TeamNode,
} from "@ukdanceblue/common";
import { ConcreteResult } from "@ukdanceblue/common/error";
import { Ok, Option } from "ts-results-es";
import { Arg, Ctx, Query, Resolver } from "type-graphql";

import { ConfigurationResolver } from "#resolvers/ConfigurationResolver.js";
import { DeviceResolver } from "#resolvers/DeviceResolver.js";
import { EventResolver } from "#resolvers/EventResolver.js";
// import { FeedResolver } from "#resolvers/FeedResolver.js";
import { FundraisingAssignmentResolver } from "#resolvers/FundraisingAssignmentResolver.js";
import {
  FundraisingEntryResolver,
  SolicitationCodeResolver,
} from "#resolvers/FundraisingEntryResolver.js";
import { ImageResolver } from "#resolvers/ImageResolver.js";
import { MarathonHourResolver } from "#resolvers/MarathonHourResolver.js";
import { MarathonResolver } from "#resolvers/MarathonResolver.js";
import { NotificationResolver } from "#resolvers/NotificationResolver.js";
import { PersonResolver } from "#resolvers/PersonResolver.js";
import { PointEntryResolver } from "#resolvers/PointEntryResolver.js";
import { PointOpportunityResolver } from "#resolvers/PointOpportunityResolver.js";
import { TeamResolver } from "#resolvers/TeamResolver.js";

import type { GraphQLContext } from "./context.js";
import {
  DailyDepartmentNotificationBatchResolver,
  DailyDepartmentNotificationResolver,
} from "./DailyDepartmentNotification.js";
import { FeedResolver } from "./FeedResolver.js";

@Resolver(() => Node)
@Service([
  ConfigurationResolver,
  DeviceResolver,
  DailyDepartmentNotificationResolver,
  DailyDepartmentNotificationBatchResolver,
  EventResolver,
  ImageResolver,
  PersonResolver,
  // MembershipResolver,
  NotificationResolver,
  // NotificationDeliveryResolver,
  TeamResolver,
  // LoginStateResolver,
  PointEntryResolver,
  PointOpportunityResolver,
  MarathonHourResolver,
  MarathonResolver,
  FeedResolver,
  FundraisingAssignmentResolver,
  FundraisingEntryResolver,
  // NodeResolver,
  SolicitationCodeResolver,
  // ReportResolver,
])
export class NodeResolver {
  constructor(
    private readonly configurationResolver: ConfigurationResolver,
    private readonly deviceResolver: DeviceResolver,
    private readonly dailyDepartmentNotificationResolver: DailyDepartmentNotificationResolver,
    private readonly dailyDepartmentNotificationBatchResolver: DailyDepartmentNotificationBatchResolver,
    private readonly eventResolver: EventResolver,
    private readonly imageResolver: ImageResolver,
    private readonly personResolver: PersonResolver,
    // private readonly membershipResolver: MembershipResolver,
    private readonly notificationResolver: NotificationResolver,
    // private readonly notificationDeliveryResolver: NotificationDeliveryResolver,
    private readonly teamResolver: TeamResolver,
    // private readonly loginStateResolver: LoginStateResolver,
    private readonly pointEntryResolver: PointEntryResolver,
    private readonly pointOpportunityResolver: PointOpportunityResolver,
    private readonly marathonHourResolver: MarathonHourResolver,
    private readonly marathonResolver: MarathonResolver,
    private readonly feedResolver: FeedResolver,
    private readonly fundraisingAssignmentResolver: FundraisingAssignmentResolver,
    private readonly fundraisingEntryResolver: FundraisingEntryResolver,
    // private readonly nodeResolver: NodeResolver,
    private readonly solicitationCodeResolver: SolicitationCodeResolver
    // private readonly reportResolver: ReportResolver
  ) {}

  @Query(() => Node)
  async node(
    @Arg("id", () => GlobalIdScalar) id: GlobalId,
    @Ctx() ctx: GraphQLContext
  ): Promise<ConcreteResult<Node> | ConcreteResult<Option<Node>>> {
    switch (id.typename) {
      case DailyDepartmentNotificationNode.constructor.name: {
        return this.dailyDepartmentNotificationResolver.dailyDepartmentNotification(
          id
        );
      }
      case DailyDepartmentNotificationBatchNode.constructor.name: {
        return this.dailyDepartmentNotificationBatchResolver.dailyDepartmentNotificationBatch(
          id
        );
      }
      case SolicitationCodeNode.constructor.name: {
        return this.solicitationCodeResolver.solicitationCode(id);
      }
      case ConfigurationNode.constructor.name: {
        return this.configurationResolver.configuration(id);
      }
      case DeviceNode.constructor.name: {
        const data = await this.deviceResolver.deviceLegacy(id.id);
        return Ok(data.data);
      }
      case EventNode.constructor.name: {
        const data = await this.eventResolver.event(id);
        return Ok(data);
      }
      case FeedResolver.constructor.name: {
        return this.feedResolver.feedItem(id);
      }
      case FundraisingAssignmentNode.constructor.name: {
        return this.fundraisingAssignmentResolver.fundraisingAssignment(id);
      }
      case FundraisingEntryNode.constructor.name: {
        return this.fundraisingEntryResolver.fundraisingEntry(id);
      }
      case ImageNode.constructor.name: {
        const data = await this.imageResolver.image(id, ctx);
        return Ok(data);
      }
      case MarathonHourNode.constructor.name: {
        const data = await this.marathonHourResolver.marathonHour(id);
        return Ok(data);
      }
      case MarathonNode.constructor.name: {
        return this.marathonResolver.marathon(id);
      }
      case NotificationNode.constructor.name: {
        return this.notificationResolver.notification(id);
      }
      case PersonNode.constructor.name: {
        return this.personResolver.person(id);
      }
      case PointOpportunityNode.constructor.name: {
        const data = await this.pointOpportunityResolver.pointOpportunity(id);
        return Ok(data);
      }
      case PointEntryNode.constructor.name: {
        const data = await this.pointEntryResolver.pointEntry(id);
        return Ok(data);
      }
      case TeamNode.constructor.name: {
        return this.teamResolver.team(id);
      }
      default: {
        throw new Error(`Unknown typename: ${id.typename}`);
      }
    }
  }
}

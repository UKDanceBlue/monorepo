import { ConfigurationResolver } from "#resolvers/ConfigurationResolver.js";
import { DeviceResolver } from "#resolvers/DeviceResolver.js";
import { EventResolver } from "#resolvers/EventResolver.js";
// import { FeedResolver } from "#resolvers/FeedResolver.js";
import { FundraisingAssignmentResolver } from "#resolvers/FundraisingAssignmentResolver.js";
import { FundraisingEntryResolver } from "#resolvers/FundraisingEntryResolver.js";
import { ImageResolver } from "#resolvers/ImageResolver.js";
import { MarathonHourResolver } from "#resolvers/MarathonHourResolver.js";
import { MarathonResolver } from "#resolvers/MarathonResolver.js";
import { NotificationResolver } from "#resolvers/NotificationResolver.js";
import { PersonResolver } from "#resolvers/PersonResolver.js";
import { PointEntryResolver } from "#resolvers/PointEntryResolver.js";
import { PointOpportunityResolver } from "#resolvers/PointOpportunityResolver.js";
import { TeamResolver } from "#resolvers/TeamResolver.js";

import {
  ConfigurationNode,
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
  TeamNode,
} from "@ukdanceblue/common";
import { ConcreteResult } from "@ukdanceblue/common/error";
import { Ok } from "ts-results-es";
import { Arg, Query, Resolver } from "type-graphql";
import { Service } from "@freshgum/typedi";

import type { GlobalId } from "@ukdanceblue/common";
import { FeedResolver } from "./FeedResolver.js";

@Resolver(() => Node)
@Service([
  ConfigurationResolver,
  DeviceResolver,
  EventResolver,
  FeedResolver,
  FundraisingAssignmentResolver,
  FundraisingEntryResolver,
  ImageResolver,
  MarathonHourResolver,
  MarathonResolver,
  NotificationResolver,
  PersonResolver,
  PointOpportunityResolver,
  PointEntryResolver,
  TeamResolver,
])
export class NodeResolver {
  constructor(
    private readonly configurationResolver: ConfigurationResolver,
    private readonly deviceResolver: DeviceResolver,
    private readonly eventResolver: EventResolver,
    private readonly feedResolver: FeedResolver,
    private readonly fundraisingAssignmentResolver: FundraisingAssignmentResolver,
    private readonly fundraisingEntryResolver: FundraisingEntryResolver,
    private readonly imageResolver: ImageResolver,
    private readonly marathonHourResolver: MarathonHourResolver,
    private readonly marathonResolver: MarathonResolver,
    private readonly notificationResolver: NotificationResolver,
    private readonly personResolver: PersonResolver,
    private readonly pointOpportunityResolver: PointOpportunityResolver,
    private readonly pointEntryResolver: PointEntryResolver,
    private readonly teamResolver: TeamResolver
  ) {}

  @Query(() => Node)
  async node(
    @Arg("id", () => GlobalIdScalar) id: GlobalId
  ): Promise<ConcreteResult<Node>> {
    switch (id.typename) {
      case ConfigurationNode.constructor.name: {
        const data = await this.configurationResolver.getByUuid(id);
        return data.map(({ data }) => data);
      }
      case DeviceNode.constructor.name: {
        const { data } = await this.deviceResolver.getByUuid(id.id);
        return Ok(data);
      }
      case EventNode.constructor.name: {
        const { data } = await this.eventResolver.getByUuid(id);
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
        const { data } = await this.imageResolver.getByUuid(id);
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
        const result = await this.notificationResolver.getByUuid(id);
        return result.map(({ data }) => data);
      }
      case PersonNode.constructor.name: {
        return this.personResolver.getByUuid(id);
      }
      case PointOpportunityNode.constructor.name: {
        const { data } = await this.pointOpportunityResolver.getByUuid(id);
        return Ok(data);
      }
      case PointEntryNode.constructor.name: {
        const { data } = await this.pointEntryResolver.getByUuid(id);
        return Ok(data);
      }
      case TeamNode.constructor.name: {
        const data = await this.teamResolver.getByUuid(id);
        return data.map(({ data: team }) => team);
      }
      default: {
        throw new Error(`Unknown typename: ${id.typename}`);
      }
    }
  }
}

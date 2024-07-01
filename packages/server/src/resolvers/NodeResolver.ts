import type { GlobalId } from "@ukdanceblue/common";
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
import { ok } from "true-myth/result";
import { Arg, Query, Resolver } from "type-graphql";
import { Service } from "typedi";

import { ConcreteResult } from "../lib/error/result.js";

import { ConfigurationResolver } from "./ConfigurationResolver.js";
import { DeviceResolver } from "./DeviceResolver.js";
import { EventResolver } from "./EventResolver.js";
// import { FeedResolver } from "./FeedResolver.js";
import { FundraisingAssignmentResolver } from "./FundraisingAssignmentResolver.js";
import { FundraisingEntryResolver } from "./FundraisingEntryResolver.js";
import { ImageResolver } from "./ImageResolver.js";
import { MarathonHourResolver } from "./MarathonHourResolver.js";
import { MarathonResolver } from "./MarathonResolver.js";
import { NotificationResolver } from "./NotificationResolver.js";
import { PersonResolver } from "./PersonResolver.js";
import { PointEntryResolver } from "./PointEntryResolver.js";
import { PointOpportunityResolver } from "./PointOpportunityResolver.js";
import { TeamResolver } from "./TeamResolver.js";

@Resolver(() => Node)
@Service()
export class NodeResolver {
  constructor(
    private readonly configurationResolver: ConfigurationResolver,
    private readonly deviceResolver: DeviceResolver,
    private readonly eventResolver: EventResolver,
    // private readonly feedResolver: FeedResolver,
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
        const { data } = await this.configurationResolver.getByUuid(id);
        return ok(data);
      }
      case DeviceNode.constructor.name: {
        const { data } = await this.deviceResolver.getByUuid(id);
        return ok(data);
      }
      case EventNode.constructor.name: {
        const { data } = await this.eventResolver.getByUuid(id);
        return ok(data);
      }
      // TODO: fix this
      // case FeedResolver.constructor.name: {
      //   const { data } = await this.feedResolver.getByUuid(id);
      //   return ok(data);
      // }
      case FundraisingAssignmentNode.constructor.name: {
        return this.fundraisingAssignmentResolver.fundraisingAssignment(id);
      }
      case FundraisingEntryNode.constructor.name: {
        return this.fundraisingEntryResolver.fundraisingEntry(id);
      }
      case ImageNode.constructor.name: {
        const { data } = await this.imageResolver.getByUuid(id);
        return ok(data);
      }
      case MarathonHourNode.constructor.name: {
        const data = await this.marathonHourResolver.marathonHour(id);
        return ok(data);
      }
      case MarathonNode.constructor.name: {
        return this.marathonResolver.marathon(id);
      }
      case NotificationNode.constructor.name: {
        const { data } = await this.notificationResolver.getByUuid(id);
        return ok(data);
      }
      case PersonNode.constructor.name: {
        const { data } = await this.personResolver.getByUuid(id);
        return ok(data);
      }
      case PointOpportunityNode.constructor.name: {
        const { data } = await this.pointOpportunityResolver.getByUuid(id);
        return ok(data);
      }
      case PointEntryNode.constructor.name: {
        const { data } = await this.pointEntryResolver.getByUuid(id);
        return ok(data);
      }
      case TeamNode.constructor.name: {
        const { data } = await this.teamResolver.getByUuid(id);
        return ok(data);
      }
      default: {
        throw new Error(`Unknown typename: ${id.typename}`);
      }
    }
  }
}

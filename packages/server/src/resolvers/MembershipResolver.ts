import {
  ErrorCode,
  MembershipResource,
  PersonResource,
  TeamResource,
} from "@ukdanceblue/common";
import { FieldResolver, Resolver, Root } from "type-graphql";

import { MembershipModel } from "../models/Membership.js";
import { PersonModel } from "../models/Person.js";
import { TeamModel } from "../models/Team.js";

import { DetailedError } from "@ukdanceblue/common";

@Resolver(() => MembershipResource)
export class MembershipResolver {
  @FieldResolver(() => PersonResource)
  async person(
    @Root() membership: MembershipResource
  ): Promise<PersonResource> {
    const row = await MembershipModel.findByUuid(membership.uuid, {
      include: [PersonModel],
      attributes: ["uuid", "personId"],
    });

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "Membership not found");
    }
    if (row.person == null) {
      throw new DetailedError(ErrorCode.NotFound, "Person not found");
    }

    return row.person.toResource();
  }

  @FieldResolver(() => TeamResource)
  async team(@Root() membership: MembershipResource): Promise<TeamResource> {
    const row = await MembershipModel.findByUuid(membership.uuid, {
      include: [TeamModel],
      attributes: ["uuid", "teamId"],
    });

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "Membership not found");
    }
    if (row.team == null) {
      throw new DetailedError(ErrorCode.NotFound, "Team not found");
    }

    return row.team.toResource();
  }
}

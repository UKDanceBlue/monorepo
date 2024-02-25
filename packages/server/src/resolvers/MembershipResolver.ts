import {
  DetailedError,
  ErrorCode,
  MembershipResource,
  PersonResource,
  TeamResource,
} from "@ukdanceblue/common";
import { FieldResolver, Resolver, Root } from "type-graphql";
import { Service } from "typedi";

import { MembershipRepository } from "../repositories/membership/MembershipRepository.js";
import { personModelToResource } from "../repositories/person/personModelToResource.js";
import { teamModelToResource } from "../repositories/team/teamModelToResource.js";

@Resolver(() => MembershipResource)
@Service()
export class MembershipResolver {
  constructor(private readonly membershipRepository: MembershipRepository) {}

  @FieldResolver(() => PersonResource)
  async person(
    @Root() membership: MembershipResource
  ): Promise<PersonResource> {
    const row = await this.membershipRepository.findMembershipByUnique(
      { uuid: membership.uuid },
      {
        person: true,
      }
    );

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "Membership not found");
    }

    return personModelToResource(row.person);
  }

  @FieldResolver(() => TeamResource)
  async team(@Root() membership: MembershipResource): Promise<TeamResource> {
    const row = await this.membershipRepository.findMembershipByUnique(
      { uuid: membership.uuid },
      {
        team: true,
      }
    );

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "Membership not found");
    }

    return teamModelToResource(row.team);
  }
}

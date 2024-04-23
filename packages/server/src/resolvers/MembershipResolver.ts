import {
  DetailedError,
  ErrorCode,
  MembershipNode,
  PersonNode,
  TeamNode,
} from "@ukdanceblue/common";
import { FieldResolver, Resolver, Root } from "type-graphql";
import { Service } from "typedi";

import { MembershipRepository } from "../repositories/membership/MembershipRepository.js";
import { personModelToResource } from "../repositories/person/personModelToResource.js";
import { teamModelToResource } from "../repositories/team/teamModelToResource.js";

@Resolver(() => MembershipNode)
@Service()
export class MembershipResolver {
  constructor(private readonly membershipRepository: MembershipRepository) {}

  @FieldResolver(() => PersonNode)
  async person(@Root() membership: MembershipNode): Promise<PersonNode> {
    const row = await this.membershipRepository.findMembershipByUnique(
      { uuid: membership.uuid },
      {
        person: true,
      }
    );

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "$1Node not found");
    }

    return personModelToResource(row.person);
  }

  @FieldResolver(() => TeamNode)
  async team(@Root() membership: MembershipNode): Promise<TeamNode> {
    const row = await this.membershipRepository.findMembershipByUnique(
      { uuid: membership.uuid },
      {
        team: true,
      }
    );

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "$1Node not found");
    }

    return teamModelToResource(row.team);
  }
}

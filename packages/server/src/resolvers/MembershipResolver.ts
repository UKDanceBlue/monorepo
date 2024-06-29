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
import { PersonRepository } from "../repositories/person/PersonRepository.js";
import { personModelToResource } from "../repositories/person/personModelToResource.js";
import { teamModelToResource } from "../repositories/team/teamModelToResource.js";
@Resolver(() => MembershipNode)
@Service()
export class MembershipResolver {
  constructor(
    private readonly membershipRepository: MembershipRepository,
    private readonly personRepository: PersonRepository
  ) {}

  @FieldResolver(() => PersonNode)
  async person(@Root() { id: { id } }: MembershipNode): Promise<PersonNode> {
    const row = await this.membershipRepository.findMembershipByUnique(
      { uuid: id },
      {
        person: true,
      }
    );

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "$1Node not found");
    }

    return personModelToResource(row.person, this.personRepository);
  }

  @FieldResolver(() => TeamNode)
  async team(@Root() { id: { id } }: MembershipNode): Promise<TeamNode> {
    const row = await this.membershipRepository.findMembershipByUnique(
      { uuid: id },
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

import { MembershipNode, PersonNode, TeamNode } from "@ukdanceblue/common";
import { ConcreteResult } from "@ukdanceblue/common/error";
import { FieldResolver, Resolver, Root } from "type-graphql";
import { Service } from "typedi";

import { MembershipRepository } from "#repositories/membership/MembershipRepository.js";
import { PersonRepository } from "#repositories/person/PersonRepository.js";
import { personModelToResource } from "#repositories/person/personModelToResource.js";
import { teamModelToResource } from "#repositories/team/teamModelToResource.js";
@Resolver(() => MembershipNode)
@Service()
export class MembershipResolver {
  constructor(
    private readonly membershipRepository: MembershipRepository,
    private readonly personRepository: PersonRepository
  ) {}

  @FieldResolver(() => PersonNode)
  async person(
    @Root() { id: { id } }: MembershipNode
  ): Promise<ConcreteResult<PersonNode>> {
    const row = await this.membershipRepository.findMembershipByUnique(
      { uuid: id },
      {
        person: true,
      }
    );

    return row
      .toAsyncResult()
      .andThen((row) =>
        personModelToResource(row.person, this.personRepository)
      ).promise;
  }

  @FieldResolver(() => TeamNode)
  async team(
    @Root() { id: { id } }: MembershipNode
  ): Promise<ConcreteResult<TeamNode>> {
    const row = await this.membershipRepository.findMembershipByUnique(
      { uuid: id },
      {
        team: true,
      }
    );

    return row.map((row) => teamModelToResource(row.team));
  }
}

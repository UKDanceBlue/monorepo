import { Service } from "@freshgum/typedi";
import {
  CommitteeRole,
  MembershipNode,
  PersonNode,
  TeamNode,
} from "@ukdanceblue/common";
import { ConcreteResult } from "@ukdanceblue/common/error";
import { GraphQLNonNegativeInt } from "graphql-scalars";
import { AsyncResult } from "ts-results-es";
import { FieldResolver, Resolver, Root } from "type-graphql";

import { MembershipRepository } from "#repositories/membership/MembershipRepository.js";
import { personModelToResource } from "#repositories/person/personModelToResource.js";
import { PersonRepository } from "#repositories/person/PersonRepository.js";
import { teamModelToResource } from "#repositories/team/teamModelToResource.js";

@Resolver(() => MembershipNode)
@Service([MembershipRepository, PersonRepository])
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

  @FieldResolver(() => CommitteeRole, { nullable: true })
  async committeeRole(
    @Root() { id: { id } }: MembershipNode
  ): Promise<ConcreteResult<CommitteeRole | null>> {
    return new AsyncResult(
      this.membershipRepository.findMembershipByUnique({ uuid: id })
    ).map((row) => row.committeeRole).promise;
  }

  @FieldResolver(() => GraphQLNonNegativeInt)
  async points(
    @Root() { id: { id } }: MembershipNode
  ): Promise<ConcreteResult<number>> {
    return new AsyncResult(
      this.membershipRepository.totalPointsFromMembership({ uuid: id })
    ).promise;
  }

  // TODO: Add a field resolver for the amount of points someone has for this membership
}

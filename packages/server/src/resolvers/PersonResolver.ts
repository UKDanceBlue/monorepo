import { Service } from "@freshgum/typedi";
import type { CrudResolver, GlobalId } from "@ukdanceblue/common";
import {
  AccessControlAuthorized,
  AccessLevel,
  CommitteeMembershipNode,
  FilterGroupOperator,
  FundraisingAssignmentNode,
  GlobalIdScalar,
  MembershipNode,
  MembershipPositionType,
  PersonNode,
  SetPasswordInput,
  SingleStringFilter,
  SingleTargetOperators,
  SomeFilter,
  TeamType,
} from "@ukdanceblue/common";
import {
  BulkPersonInput,
  CreatePersonInput,
  ListPeopleArgs,
  ListPeopleResponse,
  SetPersonInput,
} from "@ukdanceblue/common";
import {
  ActionDeniedError,
  ConcreteError,
  ErrorCode,
  extractNotFound,
  NotFoundError,
} from "@ukdanceblue/common/error";
import { AsyncResult, Err, None, Ok, Option, Some } from "ts-results-es";
import {
  Arg,
  Args,
  Ctx,
  FieldResolver,
  Float,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";

import type { GraphQLContext } from "#auth/context.js";
import { WithAuditLogging } from "#lib/logging/auditLogging.js";
import {
  mapToResource,
  mapToResources,
} from "#repositories/DefaultRepository.js";
import { fundraisingAssignmentModelToNode } from "#repositories/fundraising/fundraisingAssignmentModelToNode.js";
import { FundraisingEntryRepository } from "#repositories/fundraising/FundraisingRepository.js";
import { MembershipRepository } from "#repositories/membership/MembershipRepository.js";
import { PersonRepository } from "#repositories/person/PersonRepository.js";

@Resolver(() => PersonNode)
@Service([PersonRepository, MembershipRepository, FundraisingEntryRepository])
export class PersonResolver
  implements CrudResolver<PersonNode, "person", "people">
{
  constructor(
    private readonly personRepository: PersonRepository,
    private readonly membershipRepository: MembershipRepository,
    private readonly fundraisingEntryRepository: FundraisingEntryRepository
  ) {}

  @WithAuditLogging()
  @AccessControlAuthorized("get")
  @Query(() => PersonNode, { name: "person" })
  person(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId
  ): AsyncResult<PersonNode, ConcreteError> {
    return this.personRepository
      .findOne({ by: { uuid: id } })
      .map(mapToResource);
  }

  @AccessControlAuthorized("get")
  @Query(() => PersonNode, { name: "personByLinkBlue", nullable: true })
  getByLinkBlueId(
    @Arg("linkBlueId") linkBlueId: string
  ): AsyncResult<Option<PersonNode>, ConcreteError> {
    return this.personRepository
      .findOne({ by: { linkblue: linkBlueId.toLowerCase() } })
      .map(mapToResource)
      .map<Option<PersonNode>>((val) => Some(val))
      .orElse((err) => (err.tag === ErrorCode.NotFound ? Ok(None) : Err(err)));
  }

  @AccessControlAuthorized("list")
  @Query(() => ListPeopleResponse, { name: "people" })
  people(
    @Args(() => ListPeopleArgs) args: ListPeopleArgs
  ): AsyncResult<ListPeopleResponse, ConcreteError> {
    return this.personRepository
      .findAndCount({ param: args })
      .map(({ total, selectedRows }) =>
        ListPeopleResponse.newPaginated({
          total,
          data: mapToResources(selectedRows),
        })
      );
  }

  @Query(() => PersonNode, { name: "me", nullable: true })
  me(@Ctx() ctx: GraphQLContext): PersonNode | null {
    return ctx.authenticatedUser;
  }

  @AccessControlAuthorized("list")
  @Query(() => [PersonNode], { name: "searchPeopleByName" })
  searchByName(
    @Arg("name") name: string
  ): AsyncResult<PersonNode[], ConcreteError> {
    return this.personRepository
      .findAndCount({
        param: {
          filters: {
            operator: FilterGroupOperator.AND,
            children: [],
            filters: [
              {
                field: "name",
                filter: SomeFilter.from(
                  SingleStringFilter.from(
                    `%${name}%`,
                    SingleTargetOperators.LIKE
                  )
                ),
                negate: false,
              },
            ],
          },
        },
      })
      .map(({ selectedRows }) => mapToResources(selectedRows));
  }

  @AccessControlAuthorized("create")
  @Mutation(() => PersonNode, { name: "createPerson" })
  createPerson(
    @Arg("input") input: CreatePersonInput,
    @Ctx() { accessLevel }: GraphQLContext
  ): AsyncResult<PersonNode, ConcreteError> {
    if (
      (input.memberOf ?? []).some(
        ({ committeeRole }) => committeeRole != null
      ) &&
      accessLevel < AccessLevel.Admin
    ) {
      return Err(
        new ActionDeniedError(
          "Only tech committee can create committee members"
        )
      ).toAsyncResult();
    } else if (
      (input.captainOf ?? []).some(
        ({ committeeRole }) => committeeRole != null
      ) &&
      accessLevel < AccessLevel.Admin
    ) {
      return Err(
        new ActionDeniedError(
          "Only tech committee can create committee members"
        )
      ).toAsyncResult();
    }

    const person = this.personRepository.create({
      init: {
        name: input.name,
        email: input.email,
        linkblue: input.linkblue?.toLowerCase(),
        memberOf: input.memberOf?.map(({ id: { id }, committeeRole }) => ({
          uuid: id,
          committeeRole,
        })),
        captainOf: input.captainOf?.map(({ id: { id }, committeeRole }) => ({
          uuid: id,
          committeeRole,
        })),
      },
    });

    return person.map(mapToResource);
  }

  @AccessControlAuthorized("modify")
  @Mutation(() => PersonNode, { name: "setPerson" })
  setPerson(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId,
    @Arg("input") input: SetPersonInput,
    @Ctx() { accessLevel }: GraphQLContext
  ): AsyncResult<PersonNode, ConcreteError> {
    if (
      (input.memberOf ?? []).some(
        ({ committeeRole }) => committeeRole != null
      ) &&
      accessLevel < AccessLevel.Admin
    ) {
      return Err(
        new ActionDeniedError(
          "Only tech committee can modify committee members"
        )
      ).toAsyncResult();
    } else if (
      (input.captainOf ?? []).some(
        ({ committeeRole }) => committeeRole != null
      ) &&
      accessLevel < AccessLevel.Admin
    ) {
      return Err(
        new ActionDeniedError(
          "Only tech committee can modify committee members"
        )
      ).toAsyncResult();
    }

    return this.personRepository
      .update({
        by: {
          uuid: id,
        },
        init: {
          name: input.name,
          email: input.email,
          linkblue: input.linkblue?.toLowerCase(),
          memberOf: input.memberOf?.map(({ id: { id }, committeeRole }) => ({
            uuid: id,
            committeeRole,
          })),
          captainOf: input.captainOf?.map(({ id: { id }, committeeRole }) => ({
            uuid: id,
            committeeRole,
          })),
        },
      })
      .map(mapToResource);
  }

  @AccessControlAuthorized("create")
  @Mutation(() => [PersonNode], { name: "bulkLoadPeople" })
  bulkLoad(
    @Arg("people", () => [BulkPersonInput]) people: BulkPersonInput[],
    @Arg("marathonId", () => GlobalIdScalar) marathonId: GlobalId
  ): AsyncResult<PersonNode[], ConcreteError> {
    for (const person of people) {
      if (person.committee || person.role) {
        return Err(
          new ActionDeniedError(
            "Only tech committee can create committee members"
          )
        ).toAsyncResult();
      }
    }

    return this.personRepository
      .createMultiple({ data: people, marathonId: marathonId.id })
      .map(mapToResources);
  }

  @AccessControlAuthorized("update", "TeamNode", ".members")
  @Mutation(() => MembershipNode, { name: "addPersonToTeam" })
  assignPersonToTeam(
    @Arg("personUuid", () => GlobalIdScalar) personUuid: GlobalId,
    @Arg("teamUuid", () => GlobalIdScalar) teamUuid: GlobalId,
    @Arg("position", () => MembershipPositionType, {
      defaultValue: MembershipPositionType.Member,
    })
    position: MembershipPositionType
  ): AsyncResult<MembershipNode, ConcreteError> {
    return new AsyncResult(
      this.membershipRepository.assignPersonToTeam({
        personParam: {
          uuid: personUuid.id,
        },
        teamParam: {
          uuid: teamUuid.id,
        },
        position,
      })
    ).map(membershipModelToResource);
  }

  @AccessControlAuthorized("update", "TeamNode", ".members")
  @Mutation(() => MembershipNode, { name: "removePersonFromTeam" })
  unassignPersonFromTeam(
    @Arg("personUuid", () => GlobalIdScalar) personUuid: GlobalId,
    @Arg("teamUuid", () => GlobalIdScalar) teamUuid: GlobalId
  ): AsyncResult<MembershipNode, ConcreteError> {
    return new AsyncResult(
      this.membershipRepository.removePersonFromTeam(
        {
          uuid: personUuid.id,
        },
        {
          uuid: teamUuid.id,
        }
      )
    ).map(membershipModelToResource);
  }

  @AccessControlAuthorized("delete")
  @Mutation(() => PersonNode, { name: "deletePerson" })
  deletePerson(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId
  ): AsyncResult<PersonNode, ConcreteError> {
    return this.personRepository
      .delete({ by: { uuid: id } })
      .map(mapToResource);
  }

  @AccessControlAuthorized("get", "PersonNode", ".memberships")
  @FieldResolver(() => [CommitteeMembershipNode])
  committees(
    @Root() { id: { id } }: PersonNode
  ): AsyncResult<CommitteeMembershipNode[], ConcreteError> {
    return new AsyncResult(
      this.personRepository.findCommitteeMembershipsOfPerson({
        uuid: id,
      })
    ).map((models) =>
      models.map((membership) => {
        return committeeMembershipModelToResource(
          membership,
          membership.team.correspondingCommittee.identifier
        );
      })
    );
  }

  @AccessControlAuthorized("get", "PersonNode", ".memberships")
  @FieldResolver(() => [MembershipNode])
  teams(
    @Root() { id: { id } }: PersonNode
  ): AsyncResult<MembershipNode[], ConcreteError> {
    return new AsyncResult(
      this.personRepository.findMembershipsOfPerson({
        uuid: id,
      })
    ).map((models) => models.map(membershipModelToResource));
  }

  @AccessControlAuthorized("get", "PersonNode", ".memberships")
  @FieldResolver(() => [MembershipNode])
  moraleTeams(
    @Root() { id: { id } }: PersonNode
  ): AsyncResult<MembershipNode[], ConcreteError> {
    return new AsyncResult(
      this.personRepository.findMembershipsOfPerson(
        {
          uuid: id,
        },
        {},
        [TeamType.Morale]
      )
    ).map((models) => models.map(membershipModelToResource));
  }

  @AccessControlAuthorized("get", "PersonNode", ".memberships")
  @FieldResolver(() => CommitteeMembershipNode, { nullable: true })
  async primaryCommittee(
    @Root() { id: { id } }: PersonNode
  ): Promise<AsyncResult<Option<CommitteeMembershipNode>, ConcreteError>> {
    // return extractNotFound(
    //   await new AsyncResult(
    //     this.personRepository.getPrimaryCommitteeOfPerson({
    //       uuid: id,
    //     })
    //   ).map(([membership, committee]) =>
    //     committeeMembershipModelToResource(membership, committee.identifier)
    //   ).promise
    // );
    return new AsyncResult(Ok(None));
  }

  @AccessControlAuthorized("get", "PersonNode", ".memberships")
  @FieldResolver(() => MembershipNode, { nullable: true })
  async primaryTeam(
    @Arg("teamType", () => TeamType) teamType: TeamType,
    @Root() { id: { id } }: PersonNode
  ): Promise<AsyncResult<Option<MembershipNode>, ConcreteError>> {
    const model = await this.personRepository.getPrimaryTeamOfPerson(
      {
        uuid: id,
      },
      teamType
    );

    return model.map((option) => option.map(membershipModelToResource));
  }

  @AccessControlAuthorized("list", "PersonNode", ".fundraisingAssignments")
  @FieldResolver(() => Float, { nullable: true })
  fundraisingTotalAmount(
    @Root() { id: { id } }: PersonNode
  ): AsyncResult<Option<number>, ConcreteError> {
    return this.personRepository.getTotalFundraisingAmount({
      uuid: id,
    });
  }

  // This is the only way normal dancers or committee members can access fundraising info
  // as it will only grant them the individual assignment they are associated with plus
  // shallow access to the entry itself
  @AccessControlAuthorized("list", "PersonNode", ".fundraisingAssignments")
  @FieldResolver(() => [FundraisingAssignmentNode])
  fundraisingAssignments(
    @Root() { id: { id } }: PersonNode
  ): AsyncResult<FundraisingAssignmentNode[], ConcreteError> {
    return new AsyncResult(
      this.fundraisingEntryRepository.getAssignmentsForPerson({
        uuid: id,
      })
    ).map((models) =>
      Promise.all(models.map((row) => fundraisingAssignmentModelToNode(row)))
    );
  }

  @AccessControlAuthorized("get", "PersonNode", ".password")
  @FieldResolver(() => Boolean, { name: "hasPassword" })
  async hasPassword(
    @Root() { id: { id } }: PersonNode
  ): Promise<AsyncResult<boolean, ConcreteError>> {
    return new AsyncResult(
      await this.personRepository.findPersonByUnique({ uuid: id })
    )
      .andThen((row) => row.toResult(new NotFoundError({ what: "Person" })))
      .map((row) => row.hashedPassword != null);
  }

  @AccessControlAuthorized("update", "PersonNode", ".password")
  @Mutation(() => PersonNode, { name: "setPersonPassword" })
  setPassword(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId,
    @Arg("password", () => SetPasswordInput)
    { password }: SetPasswordInput
  ): AsyncResult<PersonNode, ConcreteError> {
    return new AsyncResult(
      this.personRepository.setPassword(
        {
          uuid: id,
        },
        password ?? null
      )
    ).andThen((row) => personModelToResource(row, this.personRepository));
  }
}

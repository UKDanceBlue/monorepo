import { Service } from "@freshgum/typedi";
import type { CrudResolver, GlobalId } from "@ukdanceblue/common";
import {
  AccessControlAuthorized,
  AccessLevel,
  CommitteeMembershipNode,
  FundraisingAssignmentNode,
  GlobalIdScalar,
  MembershipNode,
  MembershipPositionType,
  PersonNode,
  SetPasswordInput,
  SortDirection,
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
  ConcreteResult,
  extractNotFound,
  NotFoundError,
} from "@ukdanceblue/common/error";
import {
  AsyncResult,
  Err,
  None,
  Ok,
  Option,
  Result,
  Some,
} from "ts-results-es";
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
import { fundraisingAssignmentModelToNode } from "#repositories/fundraising/fundraisingAssignmentModelToNode.js";
import { FundraisingEntryRepository } from "#repositories/fundraising/FundraisingRepository.js";
import {
  committeeMembershipModelToResource,
  membershipModelToResource,
} from "#repositories/membership/membershipModelToResource.js";
import { MembershipRepository } from "#repositories/membership/MembershipRepository.js";
import { personModelToResource } from "#repositories/person/personModelToResource.js";
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
  async person(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<ConcreteResult<PersonNode>> {
    return new AsyncResult(
      await this.personRepository.findPersonByUnique({ uuid: id })
    )
      .andThen((row) => row.toResult(new NotFoundError({ what: "Person" })))
      .andThen((row) => personModelToResource(row, this.personRepository))
      .promise;
  }

  @AccessControlAuthorized("get")
  @Query(() => PersonNode, { name: "personByLinkBlue", nullable: true })
  async getByLinkBlueId(
    @Arg("linkBlueId") linkBlueId: string
  ): Promise<ConcreteResult<Option<PersonNode>>> {
    const row = await this.personRepository.findPersonByUnique({
      linkblue: linkBlueId.toLowerCase(),
    });

    if (row.isErr()) {
      return Err(row.error);
    }
    if (row.value.isNone()) {
      return Ok(None);
    }
    return personModelToResource(row.value.value, this.personRepository).map(
      (val) => Some(val)
    ).promise;
  }

  @AccessControlAuthorized("list")
  @Query(() => ListPeopleResponse, { name: "people" })
  async people(
    @Args(() => ListPeopleArgs) args: ListPeopleArgs
  ): Promise<ConcreteResult<ListPeopleResponse>> {
    const [rows, total] = await Promise.all([
      this.personRepository.listPeople({
        filters: args.filters,
        order:
          args.sortBy?.map((key, i) => [
            key,
            args.sortDirection?.[i] ?? SortDirection.desc,
          ]) ?? [],
        skip:
          args.page != null && args.actualPageSize != null
            ? (args.page - 1) * args.actualPageSize
            : null,
        take: args.actualPageSize,
      }),
      this.personRepository.countPeople({ filters: args.filters }),
    ]);

    return Result.all([
      await rows
        .toAsyncResult()
        .andThen(async (rows) =>
          Result.all(
            await Promise.all(
              rows.map(
                (row) =>
                  personModelToResource(row, this.personRepository).promise
              )
            )
          )
        ).promise,
      total,
    ]).andThen<ListPeopleResponse, ConcreteError>(([rows, total]) => {
      return Ok(
        ListPeopleResponse.newPaginated({
          data: rows,
          total,
          page: args.page,
          pageSize: args.actualPageSize,
        })
      );
    });
  }

  @Query(() => PersonNode, { name: "me", nullable: true })
  me(@Ctx() ctx: GraphQLContext): PersonNode | null {
    return ctx.authenticatedUser;
  }

  @AccessControlAuthorized("list")
  @Query(() => [PersonNode], { name: "searchPeopleByName" })
  async searchByName(
    @Arg("name") name: string
  ): Promise<ConcreteResult<PersonNode[]>> {
    return new AsyncResult(this.personRepository.searchByName(name)).andThen(
      async (rows) =>
        Result.all(
          await Promise.all(
            rows.map(
              (row) => personModelToResource(row, this.personRepository).promise
            )
          )
        )
    ).promise;
  }

  @AccessControlAuthorized("create")
  @Mutation(() => PersonNode, { name: "createPerson" })
  async createPerson(
    @Arg("input") input: CreatePersonInput,
    @Ctx() { accessLevel }: GraphQLContext
  ): Promise<ConcreteResult<PersonNode>> {
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
      );
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
      );
    }

    const person = await this.personRepository.createPerson({
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
    });

    return person
      .toAsyncResult()
      .andThen((person) => personModelToResource(person, this.personRepository))
      .promise;
  }

  @AccessControlAuthorized("modify")
  @Mutation(() => PersonNode, { name: "setPerson" })
  async setPerson(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId,
    @Arg("input") input: SetPersonInput,
    @Ctx() { accessLevel }: GraphQLContext
  ): Promise<ConcreteResult<PersonNode>> {
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
      );
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
      );
    }

    return new AsyncResult(
      this.personRepository.updatePerson(
        {
          uuid: id,
        },
        {
          name: input.name,
          email: input.email,
          linkblue: input.linkblue?.toLowerCase(),
          memberOf: input.memberOf?.map(({ id: { id }, committeeRole }) => ({
            id,
            committeeRole,
          })),
          captainOf: input.captainOf?.map(({ id: { id }, committeeRole }) => ({
            id,
            committeeRole,
          })),
        }
      )
    ).andThen((row) => personModelToResource(row, this.personRepository))
      .promise;
  }

  @AccessControlAuthorized("create")
  @Mutation(() => [PersonNode], { name: "bulkLoadPeople" })
  async bulkLoad(
    @Arg("people", () => [BulkPersonInput]) people: BulkPersonInput[],
    @Arg("marathonId", () => GlobalIdScalar) marathonId: GlobalId
  ): Promise<ConcreteResult<PersonNode[]>> {
    for (const person of people) {
      if (person.committee || person.role) {
        return Err(
          new ActionDeniedError(
            "Only tech committee can create committee members"
          )
        );
      }
    }
    return new AsyncResult(
      this.personRepository.bulkLoadPeople(people, {
        uuid: marathonId.id,
      })
    ).andThen(async (rows) =>
      Result.all(
        await Promise.all(
          rows.map(
            (row) => personModelToResource(row, this.personRepository).promise
          )
        )
      )
    ).promise;
  }

  @AccessControlAuthorized("update", "TeamNode", ".members")
  @Mutation(() => MembershipNode, { name: "addPersonToTeam" })
  async assignPersonToTeam(
    @Arg("personUuid", () => GlobalIdScalar) personUuid: GlobalId,
    @Arg("teamUuid", () => GlobalIdScalar) teamUuid: GlobalId,
    @Arg("position", () => MembershipPositionType, {
      defaultValue: MembershipPositionType.Member,
    })
    position: MembershipPositionType
  ): Promise<ConcreteResult<MembershipNode>> {
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
    ).map(membershipModelToResource).promise;
  }

  @AccessControlAuthorized("update", "TeamNode", ".members")
  @Mutation(() => MembershipNode, { name: "removePersonFromTeam" })
  async unassignPersonFromTeam(
    @Arg("personUuid", () => GlobalIdScalar) personUuid: GlobalId,
    @Arg("teamUuid", () => GlobalIdScalar) teamUuid: GlobalId
  ): Promise<ConcreteResult<MembershipNode>> {
    return new AsyncResult(
      this.membershipRepository.removePersonFromTeam(
        {
          uuid: personUuid.id,
        },
        {
          uuid: teamUuid.id,
        }
      )
    ).map(membershipModelToResource).promise;
  }

  @AccessControlAuthorized("delete")
  @Mutation(() => PersonNode, { name: "deletePerson" })
  async deletePerson(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<ConcreteResult<PersonNode>> {
    return new AsyncResult(
      this.personRepository.deletePerson({ uuid: id })
    ).andThen((row) => personModelToResource(row, this.personRepository))
      .promise;
  }

  @AccessControlAuthorized("get", "PersonNode", ".memberships")
  @FieldResolver(() => [CommitteeMembershipNode])
  async committees(
    @Root() { id: { id } }: PersonNode
  ): Promise<ConcreteResult<CommitteeMembershipNode[]>> {
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
    ).promise;
  }

  @AccessControlAuthorized("get", "PersonNode", ".memberships")
  @FieldResolver(() => [MembershipNode])
  async teams(
    @Root() { id: { id } }: PersonNode
  ): Promise<ConcreteResult<MembershipNode[]>> {
    return new AsyncResult(
      this.personRepository.findMembershipsOfPerson({
        uuid: id,
      })
    ).map((models) => models.map(membershipModelToResource)).promise;
  }

  @AccessControlAuthorized("get", "PersonNode", ".memberships")
  @FieldResolver(() => [MembershipNode])
  async moraleTeams(
    @Root() { id: { id } }: PersonNode
  ): Promise<ConcreteResult<MembershipNode[]>> {
    return new AsyncResult(
      this.personRepository.findMembershipsOfPerson(
        {
          uuid: id,
        },
        {},
        [TeamType.Morale]
      )
    ).map((models) => models.map(membershipModelToResource)).promise;
  }

  @AccessControlAuthorized("get", "PersonNode", ".memberships")
  @FieldResolver(() => CommitteeMembershipNode, { nullable: true })
  async primaryCommittee(
    @Root() { id: { id } }: PersonNode
  ): Promise<ConcreteResult<Option<CommitteeMembershipNode>>> {
    return extractNotFound(
      await new AsyncResult(
        this.personRepository.getPrimaryCommitteeOfPerson({
          uuid: id,
        })
      ).map(([membership, committee]) =>
        committeeMembershipModelToResource(membership, committee.identifier)
      ).promise
    );
  }

  @AccessControlAuthorized("get", "PersonNode", ".memberships")
  @FieldResolver(() => MembershipNode, { nullable: true })
  async primaryTeam(
    @Arg("teamType", () => TeamType) teamType: TeamType,
    @Root() { id: { id } }: PersonNode
  ): Promise<ConcreteResult<Option<MembershipNode>>> {
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
  async fundraisingTotalAmount(
    @Root() { id: { id } }: PersonNode
  ): Promise<ConcreteResult<Option<number>>> {
    return this.personRepository.getTotalFundraisingAmount({
      uuid: id,
    });
  }

  // This is the only way normal dancers or committee members can access fundraising info
  // as it will only grant them the individual assignment they are associated with plus
  // shallow access to the entry itself
  @AccessControlAuthorized("list", "PersonNode", ".fundraisingAssignments")
  @FieldResolver(() => [FundraisingAssignmentNode])
  async fundraisingAssignments(
    @Root() { id: { id } }: PersonNode
  ): Promise<Result<FundraisingAssignmentNode[], ConcreteError>> {
    return new AsyncResult(
      this.fundraisingEntryRepository.getAssignmentsForPerson({
        uuid: id,
      })
    ).map((models) =>
      Promise.all(models.map((row) => fundraisingAssignmentModelToNode(row)))
    ).promise;
  }

  @AccessControlAuthorized("get", "PersonNode", ".password")
  @FieldResolver(() => Boolean, { name: "hasPassword" })
  async hasPassword(
    @Root() { id: { id } }: PersonNode
  ): Promise<ConcreteResult<boolean>> {
    return new AsyncResult(
      await this.personRepository.findPersonByUnique({ uuid: id })
    )
      .andThen((row) => row.toResult(new NotFoundError({ what: "Person" })))
      .map((row) => row.hashedPassword != null).promise;
  }

  @AccessControlAuthorized("update", "PersonNode", ".password")
  @Mutation(() => PersonNode, { name: "setPersonPassword" })
  async setPassword(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId,
    @Arg("password", () => SetPasswordInput)
    { password }: SetPasswordInput
  ): Promise<ConcreteResult<PersonNode>> {
    return new AsyncResult(
      this.personRepository.setPassword(
        {
          uuid: id,
        },
        password ?? null
      )
    ).andThen((row) => personModelToResource(row, this.personRepository))
      .promise;
  }
}

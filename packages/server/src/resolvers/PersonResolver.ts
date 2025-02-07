import { Container, Service } from "@freshgum/typedi";
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
  ConcreteResult,
  ExtendedError,
  extractNotFound,
  InvalidArgumentError,
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
import type { AsyncRepositoryResult } from "#repositories/shared.js";

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

  @AccessControlAuthorized("get", ["getId", "PersonNode", "id"])
  @Query(() => PersonNode, { name: "person" })
  async person(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<ConcreteResult<PersonNode>> {
    return new AsyncResult(
      await this.personRepository.findPersonByUnique({ uuid: id })
    )
      .andThen((row) => row.toResult(new NotFoundError("Person")))
      .andThen((row) => personModelToResource(row, this.personRepository))
      .promise;
  }

  @AccessControlAuthorized<"PersonNode">("get", (_info, { linkBlueId }) => {
    const personRepository = Container.get(PersonRepository);

    if (typeof linkBlueId !== "string") {
      return Err(new InvalidArgumentError("linkBlueId must be a string"));
    }
    return new AsyncResult(
      personRepository.findPersonByUnique({
        linkblue: linkBlueId.toLowerCase(),
      })
    )
      .andThen((row) => row.toResult(new NotFoundError("Person")))
      .map(({ uuid }) => ({ kind: "PersonNode", id: uuid }));
  })
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

  @AccessControlAuthorized("list", ["every", "PersonNode"])
  @Query(() => ListPeopleResponse, { name: "people" })
  people(
    @Args(() => ListPeopleArgs) query: ListPeopleArgs
  ): AsyncRepositoryResult<ListPeopleResponse> {
    return this.personRepository
      .findAndCount({
        filters: query.filters,
        sortBy: query.sortBy,
        offset: query.offset,
        limit: query.limit,
        search: query.search,
      })
      .andThen(async (result) => {
        return Result.all(
          await Promise.all(
            result.selectedRows.map((row) => personModelToResource(row).promise)
          )
        ).map((data) => ({ data, total: result.total }));
      })
      .map((obj) => ListPeopleResponse.newPaginated(obj));
  }

  @Query(() => PersonNode, { name: "me", nullable: true })
  me(@Ctx() ctx: GraphQLContext): PersonNode | null {
    return ctx.authenticatedUser;
  }

  @AccessControlAuthorized("list", ["every", "PersonNode"])
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

  @AccessControlAuthorized("create", ["every", "PersonNode"])
  @Mutation(() => PersonNode, { name: "createPerson" })
  @WithAuditLogging()
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

  @AccessControlAuthorized("update", ["getId", "PersonNode", "id"])
  @Mutation(() => PersonNode, { name: "setPerson" })
  @WithAuditLogging()
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

  @AccessControlAuthorized("create", ["every", "PersonNode"])
  @Mutation(() => [PersonNode], { name: "bulkLoadPeople" })
  @WithAuditLogging()
  async bulkLoad(
    @Arg("people", () => [BulkPersonInput]) people: BulkPersonInput[],
    @Arg("marathonId", () => GlobalIdScalar) marathonId: GlobalId,
    @Ctx() { ability }: GraphQLContext
  ): Promise<ConcreteResult<PersonNode[]>> {
    if (ability.cannot("manage", { kind: "CommitteeNode" }))
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

  @AccessControlAuthorized(
    "update",
    ["getId", "TeamNode", "teamUuid"],
    ".members"
  )
  @Mutation(() => MembershipNode, { name: "addPersonToTeam" })
  @WithAuditLogging()
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

  @AccessControlAuthorized(
    "update",
    ["getId", "TeamNode", "teamUuid"],
    ".members"
  )
  @Mutation(() => MembershipNode, { name: "removePersonFromTeam" })
  @WithAuditLogging()
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

  @AccessControlAuthorized("delete", ["getId", "PersonNode", "id"])
  @Mutation(() => PersonNode, { name: "deletePerson" })
  @WithAuditLogging()
  async deletePerson(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<ConcreteResult<PersonNode>> {
    return new AsyncResult(
      this.personRepository.deletePerson({ uuid: id })
    ).andThen((row) => personModelToResource(row, this.personRepository))
      .promise;
  }

  @AccessControlAuthorized(
    "get",
    ["getIdFromRoot", "PersonNode", "id"],
    ".memberships"
  )
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

  @AccessControlAuthorized(
    "get",
    ["getIdFromRoot", "PersonNode", "id"],
    ".memberships"
  )
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

  @AccessControlAuthorized(
    "get",
    ["getIdFromRoot", "PersonNode", "id"],
    ".memberships"
  )
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

  @AccessControlAuthorized(
    "get",
    ["getIdFromRoot", "PersonNode", "id"],
    ".memberships"
  )
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

  @AccessControlAuthorized(
    "get",
    ["getIdFromRoot", "PersonNode", "id"],
    ".memberships"
  )
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

  @AccessControlAuthorized(
    "get",
    ["getIdFromRoot", "PersonNode", "id"],
    ".fundraisingAssignments"
  )
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
  @AccessControlAuthorized(
    "list",
    ["getIdFromRoot", "PersonNode", "id"],
    ".fundraisingAssignments"
  )
  @FieldResolver(() => [FundraisingAssignmentNode])
  async fundraisingAssignments(
    @Root() { id: { id } }: PersonNode
  ): Promise<Result<FundraisingAssignmentNode[], ExtendedError>> {
    return new AsyncResult(
      this.fundraisingEntryRepository.getAssignmentsForPerson({
        uuid: id,
      })
    ).map((models) =>
      Promise.all(models.map((row) => fundraisingAssignmentModelToNode(row)))
    ).promise;
  }

  @AccessControlAuthorized(
    "get",
    ["getIdFromRoot", "PersonNode", "id"],
    ".password"
  )
  @FieldResolver(() => Boolean, { name: "hasPassword" })
  async hasPassword(
    @Root() { id: { id } }: PersonNode
  ): Promise<ConcreteResult<boolean>> {
    return new AsyncResult(
      await this.personRepository.findPersonByUnique({ uuid: id })
    )
      .andThen((row) => row.toResult(new NotFoundError("Person")))
      .map((row) => row.hashedPassword != null).promise;
  }

  @AccessControlAuthorized("update", ["getId", "PersonNode", "id"], ".password")
  @Mutation(() => PersonNode, { name: "setPersonPassword" })
  @WithAuditLogging()
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

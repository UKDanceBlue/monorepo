import { Container, Service } from "@freshgum/typedi";
import type { GlobalId } from "@ukdanceblue/common";
import {
  checkParam,
  ListFundraisingEntriesArgs,
  ListFundraisingEntriesResponse,
  MutationAccessControl,
} from "@ukdanceblue/common";
import {
  AccessLevel,
  CommitteeMembershipNode,
  FundraisingAssignmentNode,
  FundraisingEntryNode,
  GlobalIdScalar,
  MembershipNode,
  MembershipPositionType,
  PersonNode,
  QueryAccessControl,
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
  FormattedConcreteError,
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

import { auditLogger } from "@/logging/auditLogging.js";
import { fundraisingAssignmentModelToNode } from "@/repositories/fundraising/fundraisingAssignmentModelToNode.js";
import { fundraisingEntryModelToNode } from "@/repositories/fundraising/fundraisingEntryModelToNode.js";
import { FundraisingEntryRepository } from "@/repositories/fundraising/FundraisingRepository.js";
import {
  committeeMembershipModelToResource,
  membershipModelToResource,
} from "@/repositories/membership/membershipModelToResource.js";
import { MembershipRepository } from "@/repositories/membership/MembershipRepository.js";
import { personModelToResource } from "@/repositories/person/personModelToResource.js";
import { PersonRepository } from "@/repositories/person/PersonRepository.js";
import type { GraphQLContext } from "@/resolvers/context.js";

import { globalFundraisingAccessParam } from "./accessParams.js";

@Resolver(() => PersonNode)
@Service([PersonRepository, MembershipRepository, FundraisingEntryRepository])
export class PersonResolver {
  constructor(
    private readonly personRepository: PersonRepository,
    private readonly membershipRepository: MembershipRepository,
    private readonly fundraisingEntryRepository: FundraisingEntryRepository
  ) {}

  @QueryAccessControl({ accessLevel: AccessLevel.Committee })
  @Query(() => PersonNode, { name: "person" })
  async getByUuid(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<ConcreteResult<PersonNode>> {
    return new AsyncResult(
      await this.personRepository.findPersonByUnique({ uuid: id })
    )
      .andThen((row) => row.toResult(new NotFoundError({ what: "Person" })))
      .andThen((row) => personModelToResource(row, this.personRepository))
      .promise;
  }

  @QueryAccessControl({ accessLevel: AccessLevel.Committee })
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

  @QueryAccessControl({ accessLevel: AccessLevel.Committee })
  @Query(() => ListPeopleResponse, { name: "listPeople" })
  async list(
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

  @QueryAccessControl({ accessLevel: AccessLevel.Committee })
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

  @MutationAccessControl({
    accessLevel: AccessLevel.CommitteeChairOrCoordinator,
  })
  @Mutation(() => PersonNode, { name: "createPerson" })
  async create(
    @Arg("input") input: CreatePersonInput,
    @Ctx() { authorization: { accessLevel } }: GraphQLContext
  ): Promise<ConcreteResult<PersonNode>> {
    if (
      (input.memberOf ?? []).some(
        ({ committeeRole }) => committeeRole != null
      ) &&
      accessLevel < AccessLevel.Admin
    ) {
      return Err(
        new ActionDeniedError("Only tech committee can set committee roles")
      );
    } else if (
      (input.captainOf ?? []).some(
        ({ committeeRole }) => committeeRole != null
      ) &&
      accessLevel < AccessLevel.Admin
    ) {
      return Err(
        new ActionDeniedError("Only tech committee can set committee roles")
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

  @MutationAccessControl({
    accessLevel: AccessLevel.CommitteeChairOrCoordinator,
  })
  @Mutation(() => PersonNode, { name: "setPerson" })
  async set(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId,
    @Arg("input") input: SetPersonInput,
    @Ctx() { authorization: { accessLevel } }: GraphQLContext
  ): Promise<ConcreteResult<PersonNode>> {
    if (
      (input.memberOf ?? []).some(
        ({ committeeRole }) => committeeRole != null
      ) &&
      accessLevel < AccessLevel.Admin
    ) {
      return Err(
        new ActionDeniedError("Only tech committee can set committee roles")
      );
    } else if (
      (input.captainOf ?? []).some(
        ({ committeeRole }) => committeeRole != null
      ) &&
      accessLevel < AccessLevel.Admin
    ) {
      return Err(
        new ActionDeniedError("Only tech committee can set committee roles")
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

  @MutationAccessControl({ accessLevel: AccessLevel.SuperAdmin })
  @Mutation(() => [PersonNode], { name: "bulkLoadPeople" })
  async bulkLoad(
    @Arg("people", () => [BulkPersonInput]) people: BulkPersonInput[],
    @Arg("marathonId", () => GlobalIdScalar) marathonId: GlobalId
  ): Promise<ConcreteResult<PersonNode[]>> {
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

  @MutationAccessControl({
    accessLevel: AccessLevel.CommitteeChairOrCoordinator,
  })
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

  @MutationAccessControl({
    accessLevel: AccessLevel.CommitteeChairOrCoordinator,
  })
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

  @MutationAccessControl({
    accessLevel: AccessLevel.CommitteeChairOrCoordinator,
  })
  @Mutation(() => PersonNode, { name: "deletePerson" })
  async delete(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<ConcreteResult<PersonNode>> {
    return new AsyncResult(this.personRepository.deletePerson({ uuid: id }))
      .andThen((row) => personModelToResource(row, this.personRepository))
      .map((person) => {
        auditLogger.secure("Person deleted", {
          person: {
            name: person.name,
            email: person.email,
            uuid: person.id,
          },
        });

        return person;
      }).promise;
  }

  @QueryAccessControl(
    { accessLevel: AccessLevel.Committee },
    {
      rootMatch: [
        {
          root: "id",
          extractor: ({ userData }) => userData.userId,
        },
      ],
    }
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

  @QueryAccessControl(
    { accessLevel: AccessLevel.Committee },
    {
      rootMatch: [
        {
          root: "id",
          extractor: ({ userData }) => userData.userId,
        },
      ],
    }
  )
  @FieldResolver(() => [MembershipNode])
  async teams(
    @Root() { id: { id } }: PersonNode
  ): Promise<ConcreteResult<MembershipNode[]>> {
    return new AsyncResult(
      this.personRepository.findMembershipsOfPerson(
        {
          uuid: id,
        },
        {},
        [TeamType.Spirit]
      )
    ).map((models) => models.map(membershipModelToResource)).promise;
  }

  @QueryAccessControl(
    { accessLevel: AccessLevel.Committee },
    {
      rootMatch: [
        {
          root: "id",
          extractor: ({ userData }) => userData.userId,
        },
      ],
    }
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

  @QueryAccessControl(
    { accessLevel: AccessLevel.Committee },
    {
      rootMatch: [
        {
          root: "id",
          extractor: ({ userData }) => userData.userId,
        },
      ],
    }
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

  @QueryAccessControl(
    { accessLevel: AccessLevel.Committee },
    {
      rootMatch: [
        {
          root: "id",
          extractor: ({ userData }) => userData.userId,
        },
      ],
    }
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

  @QueryAccessControl<FundraisingEntryNode>(
    async ({ id: { id: rootPersonId } }, context): Promise<boolean> => {
      // We can't grant blanket access as otherwise people would see who else was assigned to an entry
      // You can view all assignments for an entry if you are:
      // 1. A fundraising coordinator or chair
      const globalFundraisingAccess = checkParam(
        globalFundraisingAccessParam,
        context.authorization,
        {},
        {},
        context
      );
      if (globalFundraisingAccess.isErr()) {
        return false;
      }
      if (globalFundraisingAccess.value) {
        return true;
      }
      const {
        teamMemberships,
        userData: { userId },
      } = context;

      if (userId == null) {
        return false;
      }
      // 2. The user themselves
      if (rootPersonId === userId) {
        return true;
      }

      // 3. The captain of the team the user is on
      const captainOf = teamMemberships.filter(
        (membership) => membership.position === MembershipPositionType.Captain
      );
      if (captainOf.length === 0) {
        return false;
      }

      const rootPersonMembership = await Container.get(
        PersonRepository
      ).findMembershipsOfPerson({
        uuid: rootPersonId,
      });
      if (rootPersonMembership.isErr()) {
        return false;
      }

      return captainOf.some((captain) =>
        rootPersonMembership.value.some(
          (membership) => membership.team.uuid === captain.teamId
        )
      );
    }
  )
  @FieldResolver(() => ListFundraisingEntriesResponse, { nullable: true })
  async assignedDonationEntries(
    @Root() { id: { id } }: PersonNode,
    @Args(() => ListFundraisingEntriesArgs) args: ListFundraisingEntriesArgs
  ): Promise<ListFundraisingEntriesResponse> {
    const entries = await this.fundraisingEntryRepository.listEntries(
      {
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
      },
      {
        // EXTREMELY IMPORTANT FOR SECURITY
        assignedToPerson: { uuid: id },
      }
    );
    const count = await this.fundraisingEntryRepository.countEntries(
      {
        filters: args.filters,
      },
      {
        assignedToPerson: { uuid: id },
      }
    );

    if (entries.isErr()) {
      throw new FormattedConcreteError(entries);
    }
    if (count.isErr()) {
      throw new FormattedConcreteError(count);
    }

    return ListFundraisingEntriesResponse.newPaginated({
      data: await Promise.all(
        entries.value.map((model) => fundraisingEntryModelToNode(model))
      ),
      total: count.value,
      page: args.page,
      pageSize: args.actualPageSize,
    });
  }

  @QueryAccessControl(
    // We can't grant blanket access as otherwise people would see who else was assigned to an entry
    // You can view all assignments for an entry if you are:
    // 1. A fundraising coordinator or chair
    globalFundraisingAccessParam,
    // 2. The person themselves
    {
      rootMatch: [
        {
          root: "id",
          extractor: ({ userData }) => userData.userId,
        },
      ],
    }
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
  @QueryAccessControl<FundraisingAssignmentNode>({
    rootMatch: [
      {
        root: "id",
        extractor: ({ userData }) => userData.userId,
      },
    ],
  })
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
}

import { auditLogger } from "#logging/auditLogging.js";
import { DBFundsRepository } from "#repositories/fundraising/DBFundsRepository.js";
import { FundraisingEntryRepository } from "#repositories/fundraising/FundraisingRepository.js";
import { fundraisingAssignmentModelToNode } from "#repositories/fundraising/fundraisingAssignmentModelToNode.js";
import { fundraisingEntryModelToNode } from "#repositories/fundraising/fundraisingEntryModelToNode.js";
import { MembershipRepository } from "#repositories/membership/MembershipRepository.js";
import {
  committeeMembershipModelToResource,
  membershipModelToResource,
} from "#repositories/membership/membershipModelToResource.js";
import { PersonRepository } from "#repositories/person/PersonRepository.js";
import { personModelToResource } from "#repositories/person/personModelToResource.js";
import {
  ListFundraisingEntriesArgs,
  ListFundraisingEntriesResponse,
  MutationAccessControl,
} from "@ukdanceblue/common";
import { globalFundraisingAccessParam } from "./accessParams.js";

import {
  QueryAccessControl,
  AccessLevel,
  CommitteeMembershipNode,
  FundraisingAssignmentNode,
  FundraisingEntryNode,
  GlobalIdScalar,
  MembershipNode,
  MembershipPositionType,
  PersonNode,
  SortDirection,
  TeamType,
} from "@ukdanceblue/common";
import {
  ActionDeniedError,
  ConcreteError,
  ConcreteResult,
  extractNotFound,
  FormattedConcreteError,
  NotFoundError,
} from "@ukdanceblue/common/error";
import { Err, None, Ok, Option, Result, Some } from "ts-results-es";
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
import { Container, Service } from "@freshgum/typedi";

import type { GraphQLContext } from "#resolvers/context.js";
import type { GlobalId } from "@ukdanceblue/common";
import {
  ListPeopleResponse,
  ListPeopleArgs,
  CreatePersonInput,
  SetPersonInput,
  BulkPersonInput,
} from "@ukdanceblue/common";

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
    const row = (
      await this.personRepository.findPersonByUnique({ uuid: id })
    ).andThen((row) => row.toResult(new NotFoundError({ what: "Person" })));

    return row
      .toAsyncResult()
      .andThen((row) => personModelToResource(row, this.personRepository))
      .promise;
  }

  @QueryAccessControl({ accessLevel: AccessLevel.Committee })
  @Query(() => PersonNode, { name: "personByLinkBlue", nullable: true })
  async getByLinkBlueId(
    @Arg("linkBlueId") linkBlueId: string
  ): Promise<ConcreteResult<Option<PersonNode>>> {
    const row = await this.personRepository.findPersonByUnique({
      linkblue: linkBlueId?.toLowerCase(),
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
    const rows = await this.personRepository.searchByName(name);

    return rows
      .toAsyncResult()
      .andThen(async (rows) =>
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

    const row = await this.personRepository.updatePerson(
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
    );

    return row
      .toAsyncResult()
      .andThen((row) => personModelToResource(row, this.personRepository))
      .promise;
  }

  @MutationAccessControl({ accessLevel: AccessLevel.SuperAdmin })
  @Mutation(() => [PersonNode], { name: "bulkLoadPeople" })
  async bulkLoad(
    @Arg("people", () => [BulkPersonInput]) people: BulkPersonInput[],
    @Arg("marathonId", () => GlobalIdScalar) marathonId: GlobalId
  ): Promise<ConcreteResult<PersonNode[]>> {
    const rows = await this.personRepository.bulkLoadPeople(people, {
      uuid: marathonId.id,
    });

    return rows
      .toAsyncResult()
      .andThen(async (rows) =>
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
    const membership = await this.membershipRepository.assignPersonToTeam({
      personParam: {
        uuid: personUuid.id,
      },
      teamParam: {
        uuid: teamUuid.id,
      },
      position,
    });

    return membership.map(membershipModelToResource);
  }

  @MutationAccessControl({
    accessLevel: AccessLevel.CommitteeChairOrCoordinator,
  })
  @Mutation(() => MembershipNode, { name: "removePersonFromTeam" })
  async unassignPersonFromTeam(
    @Arg("personUuid", () => GlobalIdScalar) personUuid: GlobalId,
    @Arg("teamUuid", () => GlobalIdScalar) teamUuid: GlobalId
  ): Promise<ConcreteResult<MembershipNode>> {
    const membership = await this.membershipRepository.removePersonFromTeam(
      {
        uuid: personUuid.id,
      },
      {
        uuid: teamUuid.id,
      }
    );

    return membership.map(membershipModelToResource);
  }

  @MutationAccessControl({
    accessLevel: AccessLevel.CommitteeChairOrCoordinator,
  })
  @Mutation(() => PersonNode, { name: "deletePerson" })
  async delete(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<ConcreteResult<PersonNode>> {
    const result = await this.personRepository.deletePerson({ uuid: id });

    return result
      .toAsyncResult()
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
    const models = await this.personRepository.findCommitteeMembershipsOfPerson(
      {
        uuid: id,
      }
    );

    return models.map((models) =>
      models.map((membership) => {
        return committeeMembershipModelToResource(
          membership,
          membership.team.correspondingCommittee.identifier
        );
      })
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
  @FieldResolver(() => [MembershipNode])
  async teams(
    @Root() { id: { id } }: PersonNode
  ): Promise<ConcreteResult<MembershipNode[]>> {
    const models = await this.personRepository.findMembershipsOfPerson(
      {
        uuid: id,
      },
      {},
      [TeamType.Spirit]
    );

    return models.map((models) => models.map(membershipModelToResource));
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
    const models = await this.personRepository.findMembershipsOfPerson(
      {
        uuid: id,
      },
      {},
      [TeamType.Morale]
    );

    return models.map((models) => models.map(membershipModelToResource));
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
    const models = await this.personRepository.getPrimaryCommitteeOfPerson({
      uuid: id,
    });
    const resources = models.map(([membership, committee]) =>
      committeeMembershipModelToResource(membership, committee.identifier)
    );

    return extractNotFound(resources);
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
    async (
      { id: { id } },
      { teamMemberships, userData: { userId } }
    ): Promise<boolean> => {
      // We can't grant blanket access as otherwise people would see who else was assigned to an entry
      // You can view all assignments for an entry if you are:
      // 1. A fundraising coordinator or chair
      globalFundraisingAccessParam;
      // 2. The captain of the team the entry is associated with
      if (userId == null) {
        return false;
      }
      const captainOf = teamMemberships.filter(
        (membership) => membership.position === MembershipPositionType.Captain
      );
      if (captainOf.length === 0) {
        return false;
      }

      const fundraisingEntryRepository = Container.get(
        FundraisingEntryRepository
      );
      const entry = await fundraisingEntryRepository.findEntryByUnique({
        uuid: id,
      });
      if (entry.isErr()) {
        return false;
      }
      const dbFundsRepository = Container.get(DBFundsRepository);
      const teams = await dbFundsRepository.getTeamsForDbFundsTeam({
        id: entry.value.dbFundsEntry.dbFundsTeamId,
      });
      if (teams.isErr()) {
        return false;
      }
      return captainOf.some(({ teamId }) =>
        teams.value.some((team) => team.uuid === teamId)
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
  ): Promise<FundraisingAssignmentNode[]> {
    const models =
      await this.fundraisingEntryRepository.getAssignmentsForPerson({
        uuid: id,
      });

    if (models.isErr()) {
      throw new FormattedConcreteError(models);
    }

    return Promise.all(
      models.value.map((row) => fundraisingAssignmentModelToNode(row))
    );
  }
}

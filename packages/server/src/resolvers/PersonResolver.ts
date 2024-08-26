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
import { AbstractGraphQLPaginatedResponse } from "#resolvers/ApiResponse.js";
import {
  ListFundraisingEntriesArgs,
  ListFundraisingEntriesResponse,
  globalFundraisingAccessParam,
} from "#resolvers/FundraisingEntryResolver.js";

import { TeamType } from "@prisma/client";
import {
  AccessControl,
  AccessLevel,
  CommitteeMembershipNode,
  DbRole,
  FilteredListQueryArgs,
  FundraisingAssignmentNode,
  FundraisingEntryNode,
  GlobalIdScalar,
  MembershipNode,
  MembershipPositionType,
  PersonNode,
  SortDirection,
} from "@ukdanceblue/common";
import {
  ConcreteError,
  ConcreteResult,
  FormattedConcreteError,
} from "@ukdanceblue/common/error";
import { EmailAddressResolver } from "graphql-scalars";
import { Ok, Result } from "ts-results-es";
import {
  Arg,
  Args,
  ArgsType,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { Container, Service } from "typedi";

import type { GraphQLContext } from "#resolvers/context.js";
import type { GlobalId } from "@ukdanceblue/common";

@ObjectType("ListPeopleResponse", {
  implements: AbstractGraphQLPaginatedResponse<PersonNode>,
})
class ListPeopleResponse extends AbstractGraphQLPaginatedResponse<PersonNode> {
  @Field(() => [PersonNode])
  data!: PersonNode[];
}

@ArgsType()
class ListPeopleArgs extends FilteredListQueryArgs<
  "name" | "email" | "linkblue" | "committeeRole" | "committeeName" | "dbRole",
  "name" | "email" | "linkblue",
  "committeeRole" | "committeeName" | "dbRole",
  never,
  never,
  never
>("PersonResolver", {
  all: [
    "name",
    "email",
    "linkblue",
    "committeeRole",
    "committeeName",
    "dbRole",
  ],
  string: ["name", "email", "linkblue"],
  oneOf: ["committeeRole", "committeeName", "dbRole"],
}) {}
@InputType()
class CreatePersonInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => EmailAddressResolver)
  email!: string;

  @Field(() => String, { nullable: true })
  linkblue?: string;

  @Field(() => DbRole, { nullable: true })
  dbRole?: DbRole;

  @Field(() => [String], { defaultValue: [] })
  memberOf?: string[];

  @Field(() => [String], { defaultValue: [] })
  captainOf?: string[];
}
@InputType()
class SetPersonInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => EmailAddressResolver, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  linkblue?: string;

  @Field(() => [String], { nullable: true })
  memberOf?: string[];

  @Field(() => [String], { nullable: true })
  captainOf?: string[];
}

@Resolver(() => PersonNode)
@Service()
export class PersonResolver {
  constructor(
    private readonly personRepository: PersonRepository,
    private readonly membershipRepository: MembershipRepository,
    private readonly fundraisingEntryRepository: FundraisingEntryRepository
  ) {}

  @AccessControl({ accessLevel: AccessLevel.Committee })
  @Query(() => PersonNode, { name: "person" })
  async getByUuid(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<ConcreteResult<PersonNode>> {
    const row = await this.personRepository.findPersonByUnique({ uuid: id });

    return row
      .toAsyncResult()
      .andThen((row) => personModelToResource(row, this.personRepository))
      .promise;
  }

  @AccessControl({ accessLevel: AccessLevel.Committee })
  @Query(() => PersonNode, { name: "personByLinkBlue" })
  async getByLinkBlueId(
    @Arg("linkBlueId") linkBlueId: string
  ): Promise<ConcreteResult<PersonNode>> {
    const row = await this.personRepository.findPersonByUnique({
      linkblue: linkBlueId,
    });

    return row
      .toAsyncResult()
      .andThen((row) => personModelToResource(row, this.personRepository))
      .promise;
  }

  @AccessControl({ accessLevel: AccessLevel.Committee })
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
          args.page != null && args.pageSize != null
            ? (args.page - 1) * args.pageSize
            : null,
        take: args.pageSize,
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
          pageSize: args.pageSize,
        })
      );
    });
  }

  @Query(() => PersonNode, { name: "me", nullable: true })
  me(@Ctx() ctx: GraphQLContext): PersonNode | null {
    return ctx.authenticatedUser;
  }

  @AccessControl({ accessLevel: AccessLevel.Committee })
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

  @AccessControl({ accessLevel: AccessLevel.CommitteeChairOrCoordinator })
  @Mutation(() => PersonNode, { name: "createPerson" })
  async create(
    @Arg("input") input: CreatePersonInput
  ): Promise<ConcreteResult<PersonNode>> {
    const person = await this.personRepository.createPerson({
      name: input.name,
      email: input.email,
      linkblue: input.linkblue,
    });

    return person
      .toAsyncResult()
      .andThen((person) => personModelToResource(person, this.personRepository))
      .promise;
  }

  @AccessControl({ accessLevel: AccessLevel.CommitteeChairOrCoordinator })
  @Mutation(() => PersonNode, { name: "setPerson" })
  async set(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId,
    @Arg("input") input: SetPersonInput
  ): Promise<ConcreteResult<PersonNode>> {
    const row = await this.personRepository.updatePerson(
      {
        uuid: id,
      },
      {
        name: input.name,
        email: input.email,
        linkblue: input.linkblue,
        memberOf: input.memberOf?.map((uuid) => ({ uuid })),
        captainOf: input.captainOf?.map((uuid) => ({ uuid })),
      }
    );

    return row
      .toAsyncResult()
      .andThen((row) => personModelToResource(row, this.personRepository))
      .promise;
  }

  @AccessControl({ accessLevel: AccessLevel.CommitteeChairOrCoordinator })
  @Mutation(() => MembershipNode, { name: "addPersonToTeam" })
  async assignPersonToTeam(
    @Arg("personUuid") personUuid: string,
    @Arg("teamUuid") teamUuid: string
  ): Promise<ConcreteResult<MembershipNode>> {
    const membership = await this.membershipRepository.assignPersonToTeam({
      personParam: {
        uuid: personUuid,
      },
      teamParam: {
        uuid: teamUuid,
      },
      position: MembershipPositionType.Member,
    });

    return membership.map(membershipModelToResource);
  }

  @AccessControl({ accessLevel: AccessLevel.CommitteeChairOrCoordinator })
  @Mutation(() => PersonNode, { name: "deletePerson" })
  async delete(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<ConcreteResult<PersonNode>> {
    const result = await this.personRepository.deletePerson({ uuid: id });

    return result
      .toAsyncResult()
      .andThen((row) => personModelToResource(row, this.personRepository))
      .map((person) => {
        auditLogger.sensitive("Person deleted", {
          person: {
            name: person.name,
            email: person.email,
            uuid: person.id,
          },
        });

        return person;
      }).promise;
  }

  @AccessControl(
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

  @AccessControl(
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

  @AccessControl(
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

  @AccessControl(
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
  ): Promise<ConcreteResult<CommitteeMembershipNode>> {
    const models = await this.personRepository.getPrimaryCommitteeOfPerson({
      uuid: id,
    });

    return models.map(([membership, committee]) =>
      committeeMembershipModelToResource(membership, committee.identifier)
    );
  }

  @AccessControl<FundraisingEntryNode>(
    // We can't grant blanket access as otherwise people would see who else was assigned to an entry
    // You can view all assignments for an entry if you are:
    // 1. A fundraising coordinator or chair
    globalFundraisingAccessParam,
    // 2. The captain of the team the entry is associated with
    {
      custom: async (
        { id: { id } },
        { teamMemberships, userData: { userId } }
      ): Promise<boolean> => {
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
      },
    }
  )
  @FieldResolver(() => CommitteeMembershipNode, { nullable: true })
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
          args.page != null && args.pageSize != null
            ? (args.page - 1) * args.pageSize
            : null,
        take: args.pageSize,
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
      throw new FormattedConcreteError(entries.error);
    }
    if (count.isErr()) {
      throw new FormattedConcreteError(count.error);
    }

    return ListFundraisingEntriesResponse.newPaginated({
      data: await Promise.all(
        entries.value.map((model) => fundraisingEntryModelToNode(model))
      ),
      total: count.value,
      page: args.page,
      pageSize: args.pageSize,
    });
  }

  // This is the only way normal dancers or committee members can access fundraising info
  // as it will only grant them the individual assignment they are associated with plus
  // shallow access to the entry itself
  @AccessControl<FundraisingAssignmentNode>({
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
      throw new FormattedConcreteError(models.error);
    }

    return Promise.all(
      models.value.map((row) => fundraisingAssignmentModelToNode(row))
    );
  }
}

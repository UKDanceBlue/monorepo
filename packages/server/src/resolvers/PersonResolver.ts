import { TeamType } from "@prisma/client";
import type { GlobalId } from "@ukdanceblue/common";
import {
  AccessControl,
  AccessLevel,
  CommitteeMembershipNode,
  DbRole,
  DetailedError,
  ErrorCode,
  FilteredListQueryArgs,
  FundraisingAssignmentNode,
  FundraisingEntryNode,
  GlobalIdScalar,
  MembershipNode,
  MembershipPositionType,
  PersonNode,
  SortDirection,
} from "@ukdanceblue/common";
import { EmailAddressResolver } from "graphql-scalars";
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

import { NotFoundError } from "../lib/error/direct.js";
import { CatchableConcreteError } from "../lib/formatError.js";
import { auditLogger } from "../lib/logging/auditLogging.js";
import { DBFundsRepository } from "../repositories/fundraising/DBFundsRepository.js";
import { FundraisingEntryRepository } from "../repositories/fundraising/FundraisingRepository.js";
import { fundraisingAssignmentModelToNode } from "../repositories/fundraising/fundraisingAssignmentModelToNode.js";
import { fundraisingEntryModelToNode } from "../repositories/fundraising/fundraisingEntryModelToNode.js";
import { MembershipRepository } from "../repositories/membership/MembershipRepository.js";
import {
  committeeMembershipModelToResource,
  membershipModelToResource,
} from "../repositories/membership/membershipModelToResource.js";
import { PersonRepository } from "../repositories/person/PersonRepository.js";
import { personModelToResource } from "../repositories/person/personModelToResource.js";

import {
  AbstractGraphQLArrayOkResponse,
  AbstractGraphQLCreatedResponse,
  AbstractGraphQLOkResponse,
  AbstractGraphQLPaginatedResponse,
} from "./ApiResponse.js";
import {
  ListFundraisingEntriesArgs,
  ListFundraisingEntriesResponse,
  globalFundraisingAccessParam,
} from "./FundraisingEntryResolver.js";
import type { GraphQLContext } from "./context.js";

@ObjectType("CreatePersonResponse", {
  implements: AbstractGraphQLCreatedResponse<PersonNode>,
})
class CreatePersonResponse extends AbstractGraphQLCreatedResponse<PersonNode> {
  @Field(() => PersonNode)
  data!: PersonNode;
}
@ObjectType("GetPersonResponse", {
  implements: AbstractGraphQLOkResponse<PersonNode>,
})
class GetPersonResponse extends AbstractGraphQLOkResponse<PersonNode> {
  @Field(() => PersonNode, { nullable: true })
  data!: PersonNode;
}
@ObjectType("GetMembershipResponse", {
  implements: AbstractGraphQLOkResponse<MembershipNode>,
})
class GetMembershipResponse extends AbstractGraphQLOkResponse<MembershipNode | null> {
  @Field(() => MembershipNode, { nullable: true })
  data!: MembershipNode | null;
}
@ObjectType("GetPeopleResponse", {
  implements: AbstractGraphQLArrayOkResponse<PersonNode>,
})
class GetPeopleResponse extends AbstractGraphQLArrayOkResponse<PersonNode> {
  @Field(() => [PersonNode])
  data!: PersonNode[];
}
@ObjectType("ListPeopleResponse", {
  implements: AbstractGraphQLPaginatedResponse<PersonNode>,
})
class ListPeopleResponse extends AbstractGraphQLPaginatedResponse<PersonNode> {
  @Field(() => [PersonNode])
  data!: PersonNode[];
}
@ObjectType("DeletePersonResponse", {
  implements: AbstractGraphQLOkResponse<boolean>,
})
class DeletePersonResponse extends AbstractGraphQLOkResponse<never> {}

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
  @Query(() => GetPersonResponse, { name: "person" })
  async getByUuid(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<GetPersonResponse> {
    const row = await this.personRepository.findPersonByUnique({ uuid: id });

    if (row == null) {
      throw new CatchableConcreteError(new NotFoundError({ what: "Person" }));
    }

    return GetPersonResponse.newOk<PersonNode, GetPersonResponse>(
      await personModelToResource(row, this.personRepository)
    );
  }

  @AccessControl({ accessLevel: AccessLevel.Committee })
  @Query(() => GetPersonResponse, { name: "personByLinkBlue" })
  async getByLinkBlueId(
    @Arg("linkBlueId") linkBlueId: string
  ): Promise<GetPersonResponse> {
    const row = await this.personRepository.findPersonByUnique({
      linkblue: linkBlueId,
    });

    if (row == null) {
      return GetPersonResponse.newOk<PersonNode | null, GetPersonResponse>(
        null
      );
    }

    return GetPersonResponse.newOk<PersonNode | null, GetPersonResponse>(
      await personModelToResource(row, this.personRepository)
    );
  }

  @AccessControl({ accessLevel: AccessLevel.Committee })
  @Query(() => ListPeopleResponse, { name: "listPeople" })
  async list(
    @Args(() => ListPeopleArgs) args: ListPeopleArgs
  ): Promise<ListPeopleResponse> {
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

    return ListPeopleResponse.newPaginated({
      data: await Promise.all(
        rows.map((row) => personModelToResource(row, this.personRepository))
      ),
      total,
      page: args.page,
      pageSize: args.pageSize,
    });
  }

  @Query(() => GetPersonResponse, { name: "me" })
  me(@Ctx() ctx: GraphQLContext): GetPersonResponse {
    return GetPersonResponse.newOk<PersonNode | null, GetPersonResponse>(
      ctx.authenticatedUser
    );
  }

  @AccessControl({ accessLevel: AccessLevel.Committee })
  @Query(() => GetPeopleResponse, { name: "searchPeopleByName" })
  async searchByName(@Arg("name") name: string): Promise<GetPeopleResponse> {
    const rows = await this.personRepository.searchByName(name);

    return GetPeopleResponse.newOk(
      await Promise.all(
        rows.map((row) => personModelToResource(row, this.personRepository))
      )
    );
  }

  @AccessControl({ accessLevel: AccessLevel.CommitteeChairOrCoordinator })
  @Mutation(() => CreatePersonResponse, { name: "createPerson" })
  async create(
    @Arg("input") input: CreatePersonInput
  ): Promise<CreatePersonResponse> {
    const person = await this.personRepository.createPerson({
      name: input.name,
      email: input.email,
      linkblue: input.linkblue,
    });

    return CreatePersonResponse.newCreated(
      await personModelToResource(person, this.personRepository),
      person.uuid
    );
  }

  @AccessControl({ accessLevel: AccessLevel.CommitteeChairOrCoordinator })
  @Mutation(() => GetPersonResponse, { name: "setPerson" })
  async set(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId,
    @Arg("input") input: SetPersonInput
  ): Promise<GetPersonResponse> {
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

    if (row == null) {
      return GetPersonResponse.newOk<PersonNode | null, GetPersonResponse>(
        null
      );
    }

    return GetPersonResponse.newOk<PersonNode | null, GetPersonResponse>(
      await personModelToResource(row, this.personRepository)
    );
  }

  @AccessControl({ accessLevel: AccessLevel.CommitteeChairOrCoordinator })
  @Mutation(() => GetMembershipResponse, { name: "addPersonToTeam" })
  async assignPersonToTeam(
    @Arg("personUuid") personUuid: string,
    @Arg("teamUuid") teamUuid: string
  ): Promise<GetMembershipResponse> {
    const membership = await this.membershipRepository.assignPersonToTeam({
      personParam: {
        uuid: personUuid,
      },
      teamParam: {
        uuid: teamUuid,
      },
      position: MembershipPositionType.Member,
    });

    if (membership == null) {
      return GetMembershipResponse.newOk<
        MembershipNode | null,
        GetMembershipResponse
      >(null);
    }

    return GetMembershipResponse.newOk<
      MembershipNode | null,
      GetMembershipResponse
    >(membershipModelToResource(membership));
  }

  @AccessControl({ accessLevel: AccessLevel.CommitteeChairOrCoordinator })
  @Mutation(() => DeletePersonResponse, { name: "deletePerson" })
  async delete(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<DeletePersonResponse> {
    const result = await this.personRepository.deletePerson({ uuid: id });

    if (result == null) {
      throw new DetailedError(ErrorCode.DatabaseFailure, "Failed to delete");
    }

    auditLogger.sensitive("Person deleted", {
      person: {
        name: result.name,
        email: result.email,
        uuid: result.uuid,
      },
    });

    return DeletePersonResponse.newOk(true);
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
  ): Promise<CommitteeMembershipNode[]> {
    const models = await this.personRepository.findCommitteeMembershipsOfPerson(
      {
        uuid: id,
      }
    );

    if (models == null) {
      return [];
    }

    return models.map((row) =>
      committeeMembershipModelToResource(
        row,
        row.team.correspondingCommittee!.identifier
      )
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
  async teams(@Root() { id: { id } }: PersonNode): Promise<MembershipNode[]> {
    const models = await this.personRepository.findMembershipsOfPerson(
      {
        uuid: id,
      },
      {},
      [TeamType.Spirit]
    );

    if (models == null) {
      return [];
    }

    return models.map((row) => membershipModelToResource(row));
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
  ): Promise<MembershipNode[]> {
    const models = await this.personRepository.findMembershipsOfPerson(
      {
        uuid: id,
      },
      {},
      [TeamType.Morale]
    );

    if (models == null) {
      return [];
    }

    return models.map((row) => membershipModelToResource(row));
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
  ): Promise<CommitteeMembershipNode | null> {
    const models = await this.personRepository.getPrimaryCommitteeOfPerson({
      uuid: id,
    });

    if (models == null) {
      return null;
    }

    const [membership, committee] = models;

    return committeeMembershipModelToResource(membership, committee.identifier);
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
        if (entry.isErr) {
          return false;
        }
        const dbFundsRepository = Container.get(DBFundsRepository);
        const teams = await dbFundsRepository.getTeamsForDbFundsTeam({
          id: entry.value.dbFundsEntry.dbFundsTeamId,
        });
        if (teams.isErr) {
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
    const count = await this.fundraisingEntryRepository.countEntries({
      filters: args.filters,
    });

    if (entries.isErr) {
      throw new CatchableConcreteError(entries.error);
    }
    if (count.isErr) {
      throw new CatchableConcreteError(count.error);
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

    if (models.isErr) {
      throw new CatchableConcreteError(models.error);
    }

    return Promise.all(
      models.value.map((row) => fundraisingAssignmentModelToNode(row))
    );
  }
}

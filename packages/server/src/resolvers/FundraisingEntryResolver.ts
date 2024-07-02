import { CommitteeRole } from "@prisma/client";
import type { GlobalId } from "@ukdanceblue/common";
import {
  AccessControl,
  AccessControlParam,
  CommitteeIdentifier,
  FilteredListQueryArgs,
  FundraisingAssignmentNode,
  FundraisingEntryNode,
  GlobalIdScalar,
  MembershipPositionType,
  SortDirection,
} from "@ukdanceblue/common";
import {
  Arg,
  Args,
  ArgsType,
  Field,
  FieldResolver,
  ObjectType,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { Container, Service } from "typedi";

import { ConcreteResult } from "#error/result.js";
import { CatchableConcreteError } from "#lib/formatError.js";
import { DBFundsRepository } from "#repositories/fundraising/DBFundsRepository.js";
import { FundraisingEntryRepository } from "#repositories/fundraising/FundraisingRepository.js";
import { fundraisingAssignmentModelToNode } from "#repositories/fundraising/fundraisingAssignmentModelToNode.js";
import { fundraisingEntryModelToNode } from "#repositories/fundraising/fundraisingEntryModelToNode.js";
import { AbstractGraphQLPaginatedResponse } from "#resolvers/ApiResponse.js";

@ArgsType()
export class ListFundraisingEntriesArgs extends FilteredListQueryArgs<
  | "donatedOn"
  | "amount"
  | "donatedTo"
  | "donatedBy"
  | "teamId"
  | "createdAt"
  | "updatedAt",
  "donatedTo" | "donatedBy",
  "teamId",
  "amount",
  "donatedOn" | "createdAt" | "updatedAt",
  never
>("FundraisingEntryResolver", {
  all: [
    "donatedOn",
    "amount",
    "donatedTo",
    "donatedBy",
    "createdAt",
    "updatedAt",
  ],
  string: ["donatedTo", "donatedBy"],
  numeric: ["amount"],
  oneOf: ["teamId"],
  date: ["donatedOn", "createdAt", "updatedAt"],
}) {}

@ObjectType("ListFundraisingEntriesResponse", {
  implements: AbstractGraphQLPaginatedResponse<FundraisingEntryNode[]>,
})
export class ListFundraisingEntriesResponse extends AbstractGraphQLPaginatedResponse<FundraisingEntryNode> {
  @Field(() => [FundraisingEntryNode])
  data!: FundraisingEntryNode[];
}

/**
 * Access control param for granting access to all fundraising entries.
 */
export const globalFundraisingAccessParam: AccessControlParam<
  unknown,
  unknown
> = {
  authRules: [
    {
      minCommitteeRole: CommitteeRole.Coordinator,
      committeeIdentifiers: [CommitteeIdentifier.fundraisingCommittee],
    },
  ],
};

@Resolver(() => FundraisingEntryNode)
@Service()
export class FundraisingEntryResolver {
  constructor(
    private readonly fundraisingEntryRepository: FundraisingEntryRepository
  ) {}

  @AccessControl(globalFundraisingAccessParam)
  @Query(() => FundraisingEntryNode)
  async fundraisingEntry(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<ConcreteResult<FundraisingEntryNode>> {
    const entry = await this.fundraisingEntryRepository.findEntryByUnique({
      uuid: id,
    });
    return entry.toAsyncResult().map(fundraisingEntryModelToNode).promise;
  }

  @AccessControl(globalFundraisingAccessParam)
  @Query(() => ListFundraisingEntriesResponse)
  async fundraisingEntries(
    @Args(() => ListFundraisingEntriesArgs) args: ListFundraisingEntriesArgs
  ): Promise<ListFundraisingEntriesResponse> {
    const entries = await this.fundraisingEntryRepository.listEntries({
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
    });
    const count = await this.fundraisingEntryRepository.countEntries({
      filters: args.filters,
    });

    if (entries.isErr()) {
      throw new CatchableConcreteError(entries.error);
    }
    if (count.isErr()) {
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
  @FieldResolver(() => [FundraisingAssignmentNode])
  async assignments(
    @Root() { id: { id } }: FundraisingEntryNode
  ): Promise<FundraisingAssignmentNode[]> {
    const assignments =
      await this.fundraisingEntryRepository.getAssignmentsForEntry({
        uuid: id,
      });
    if (assignments.isErr()) {
      throw new CatchableConcreteError(assignments.error);
    }
    return Promise.all(
      assignments.value.map((assignment) =>
        fundraisingAssignmentModelToNode(assignment)
      )
    );
  }
}

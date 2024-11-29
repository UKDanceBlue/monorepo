import { Container, Service } from "@freshgum/typedi";
import {
  CustomQueryAccessControl,
  type GlobalId,
  type MarathonYearString,
  SetFundraisingEntryInput,
  TeamNode,
  VoidScalar,
} from "@ukdanceblue/common";
import {
  AccessControlAuthorized,
  AccessLevel,
  checkParam,
  DailyDepartmentNotificationNode,
  FundraisingAssignmentNode,
  FundraisingEntryNode,
  GlobalIdScalar,
  MembershipPositionType,
  SolicitationCodeNode,
  SortDirection,
} from "@ukdanceblue/common";
import {
  ListFundraisingEntriesArgs,
  ListFundraisingEntriesResponse,
} from "@ukdanceblue/common";
import { ConcreteResult } from "@ukdanceblue/common/error";
import { VoidResolver } from "graphql-scalars";
import { AsyncResult, Ok, Option } from "ts-results-es";
import {
  Arg,
  Args,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";

import { DBFundsFundraisingProvider } from "#lib/fundraising/DbFundsProvider.js";
import type { FundraisingProvider } from "#lib/fundraising/FundraisingProvider.js";
import { dailyDepartmentNotificationModelToResource } from "#repositories/dailyDepartmentNotification/ddnModelToResource.js";
import { fundraisingAssignmentModelToNode } from "#repositories/fundraising/fundraisingAssignmentModelToNode.js";
import { fundraisingEntryModelToNode } from "#repositories/fundraising/fundraisingEntryModelToNode.js";
import { FundraisingEntryRepository } from "#repositories/fundraising/FundraisingRepository.js";
import { teamModelToResource } from "#repositories/team/teamModelToResource.js";

import { globalFundraisingAccessParam } from "./accessParams.js";
import { StandardResolver } from "./standardResolver.js";

@Resolver(() => FundraisingEntryNode)
@Service([DBFundsFundraisingProvider, FundraisingEntryRepository])
export class FundraisingEntryResolver
  implements
    StandardResolver<
      FundraisingEntryNode,
      "fundraisingEntry",
      "fundraisingEntries"
    >
{
  constructor(
    private readonly fundraisingProvider: FundraisingProvider<number>,
    private readonly fundraisingEntryRepository: FundraisingEntryRepository
  ) {}

  @AccessControlAuthorized(globalFundraisingAccessParam)
  @Query(() => FundraisingEntryNode)
  async fundraisingEntry(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<ConcreteResult<FundraisingEntryNode>> {
    const entry = await this.fundraisingEntryRepository.findEntryByUnique({
      uuid: id,
    });
    return entry.toAsyncResult().map(fundraisingEntryModelToNode).promise;
  }

  @AccessControlAuthorized(globalFundraisingAccessParam)
  @Query(() => ListFundraisingEntriesResponse)
  async fundraisingEntries(
    @Args(() => ListFundraisingEntriesArgs) args: ListFundraisingEntriesArgs,
    solicitationCodeId?: GlobalId
  ): Promise<ConcreteResult<ListFundraisingEntriesResponse>> {
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
      solicitationCodeId
        ? { solicitationCode: { uuid: solicitationCodeId.id } }
        : undefined
    );
    const count = await this.fundraisingEntryRepository.countEntries(
      {
        filters: args.filters,
      },
      solicitationCodeId
        ? { solicitationCode: { uuid: solicitationCodeId.id } }
        : undefined
    );

    if (entries.isErr()) {
      return entries;
    }
    if (count.isErr()) {
      return count;
    }

    return Ok(
      ListFundraisingEntriesResponse.newPaginated({
        data: await Promise.all(
          entries.value.map((model) => fundraisingEntryModelToNode(model))
        ),
        total: count.value,
        page: args.page,
        pageSize: args.actualPageSize,
      })
    );
  }

  @CustomQueryAccessControl<FundraisingEntryNode>(
    async (root, context): Promise<boolean> => {
      // We can't grant blanket access as otherwise people would see who else was assigned to an entry
      // You can view all assignments for an entry if you are:
      // 1. A fundraising coordinator or chair
      const globalFundraisingAccess = checkParam(
        globalFundraisingAccessParam,
        context.authorization,
        root,
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
        userData: { userId },
        teamMemberships,
      } = context;
      const {
        id: { id },
      } = root;

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
      const solicitationCode =
        await fundraisingEntryRepository.getSolicitationCodeForEntry(
          {
            uuid: id,
          },
          true
        );
      if (solicitationCode.isErr()) {
        return false;
      }

      return captainOf.some(({ teamId }) =>
        solicitationCode.value.teams.some((team) => team.uuid === teamId)
      );
    }
  )
  @FieldResolver(() => [FundraisingAssignmentNode])
  async assignments(
    @Root() { id: { id } }: FundraisingEntryNode
  ): Promise<ConcreteResult<FundraisingAssignmentNode[]>> {
    const assignments =
      await this.fundraisingEntryRepository.getAssignmentsForEntry({
        uuid: id,
      });

    return assignments
      .toAsyncResult()
      .map((assignments) =>
        Promise.all(
          assignments.map((assignment) =>
            fundraisingAssignmentModelToNode(assignment)
          )
        )
      ).promise;
  }

  @AccessControlAuthorized(globalFundraisingAccessParam, {
    accessLevel: AccessLevel.Admin,
  })
  @Mutation(() => FundraisingEntryNode, { name: "setFundraisingEntry" })
  async setFundraisingEntry(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId,
    @Arg("input", () => SetFundraisingEntryInput)
    input: SetFundraisingEntryInput
  ): Promise<ConcreteResult<FundraisingEntryNode>> {
    const entry = await this.fundraisingEntryRepository.setEntry(
      {
        uuid: id,
      },
      {
        amountOverride: input.amountOverride ?? null,
        batchTypeOverride: input.batchTypeOverride ?? null,
        donatedByOverride: input.donatedByOverride ?? null,
        donatedOnOverride: input.donatedOnOverride ?? null,
        donatedToOverride: input.donatedToOverride ?? null,
        notes: input.notes ?? null,
        solicitationCodeOverride: input.solicitationCodeOverrideId
          ? { uuid: input.solicitationCodeOverrideId.id }
          : null,
      }
    );
    return entry.toAsyncResult().map(fundraisingEntryModelToNode).promise;
  }

  @AccessControlAuthorized(globalFundraisingAccessParam, {
    accessLevel: AccessLevel.Admin,
  })
  @Query(() => String)
  async rawFundraisingTotals(
    @Arg("marathonYear", () => String) marathonYear: MarathonYearString
  ) {
    const result = await this.fundraisingProvider.getTeams(marathonYear);
    return result.map((data) => JSON.stringify(data));
  }

  @AccessControlAuthorized(globalFundraisingAccessParam, {
    accessLevel: AccessLevel.Admin,
  })
  @Query(() => String)
  async rawFundraisingEntries(
    @Arg("marathonYear", () => String) marathonYear: MarathonYearString,
    @Arg("identifier", () => Int) identifier: number
  ) {
    const result = await this.fundraisingProvider.getTeamEntries(
      marathonYear,
      identifier
    );
    return result
      .map((data) =>
        data.map((val) => ({
          donatedBy: val.donatedBy.unwrapOr(null),
          donatedTo: val.donatedBy.unwrapOr(null),
          donatedOn: val.donatedOn.toISO(),
          amount: val.amount,
        }))
      )
      .map((data) => JSON.stringify(data));
  }

  @FieldResolver(() => DailyDepartmentNotificationNode, { nullable: true })
  async dailyDepartmentNotification(
    @Root()
    fundraisingEntry: FundraisingEntryNode
  ): Promise<ConcreteResult<Option<DailyDepartmentNotificationNode>>> {
    const dailyDepartmentNotification =
      await this.fundraisingEntryRepository.getDdnForEntry({
        uuid: fundraisingEntry.id.id,
      });
    return dailyDepartmentNotification
      .toAsyncResult()
      .map((option) => option.map(dailyDepartmentNotificationModelToResource))
      .promise;
  }

  @FieldResolver(() => SolicitationCodeNode)
  async solicitationCode(
    @Root() { solicitationCodeOverride, id: { id: uuid } }: FundraisingEntryNode
  ): Promise<ConcreteResult<SolicitationCodeNode>> {
    if (solicitationCodeOverride != null) {
      return Ok(solicitationCodeOverride);
    }
    const solicitationCode =
      await this.fundraisingEntryRepository.getSolicitationCodeForEntry({
        uuid,
      });
    return new AsyncResult(solicitationCode).map(
      ({ uuid, id, ...solicitationCode }) =>
        SolicitationCodeNode.init({
          ...solicitationCode,
          id: uuid,
        })
    ).promise;
  }
}

@Resolver(() => SolicitationCodeNode)
@Service([FundraisingEntryRepository, FundraisingEntryResolver])
export class SolicitationCodeResolver {
  constructor(
    private readonly fundraisingEntryRepository: FundraisingEntryRepository,
    private readonly fundraisingEntryResolver: FundraisingEntryResolver
  ) {}

  @AccessControlAuthorized(globalFundraisingAccessParam)
  @Query(() => [SolicitationCodeNode])
  async solicitationCodes(): Promise<ConcreteResult<SolicitationCodeNode[]>> {
    const codes =
      await this.fundraisingEntryRepository.findAllSolicitationCodes();
    return codes.toAsyncResult().map((codes) =>
      codes.map(({ uuid, id, ...code }) =>
        SolicitationCodeNode.init({
          ...code,
          id: uuid,
        })
      )
    ).promise;
  }

  @AccessControlAuthorized(globalFundraisingAccessParam)
  @Query(() => SolicitationCodeNode)
  async solicitationCode(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<ConcreteResult<SolicitationCodeNode>> {
    const code =
      await this.fundraisingEntryRepository.findSolicitationCodeByUnique({
        uuid: id,
      });
    return code.toAsyncResult().map(({ uuid, id, ...code }) =>
      SolicitationCodeNode.init({
        ...code,
        id: uuid,
      })
    ).promise;
  }

  @AccessControlAuthorized(globalFundraisingAccessParam)
  @FieldResolver(() => ListFundraisingEntriesResponse)
  async entries(
    @Root() { id }: SolicitationCodeNode,
    @Args(() => ListFundraisingEntriesArgs) args: ListFundraisingEntriesArgs
  ): Promise<ConcreteResult<ListFundraisingEntriesResponse>> {
    return this.fundraisingEntryResolver.fundraisingEntries(args, id);
  }

  @AccessControlAuthorized(globalFundraisingAccessParam)
  @FieldResolver(() => [TeamNode])
  async teams(
    @Root() { id: { id } }: SolicitationCodeNode,
    @Arg("marathonId", () => GlobalIdScalar, { nullable: true })
    marathonId: GlobalId | null
  ): Promise<ConcreteResult<TeamNode[]>> {
    const teams =
      await this.fundraisingEntryRepository.getTeamsForSolitationCode(
        {
          uuid: id,
        },
        { marathonParam: marathonId ? { uuid: marathonId.id } : undefined }
      );

    return teams
      .toAsyncResult()
      .map((entries) => entries.map((entry) => teamModelToResource(entry)))
      .promise;
  }

  @AccessControlAuthorized(globalFundraisingAccessParam)
  @Mutation(() => VoidResolver, { name: "assignSolicitationCodeToTeam" })
  async assignSolicitationCodeToTeam(
    @Arg("teamId", () => GlobalIdScalar) { id: teamId }: GlobalId,
    @Arg("solicitationCode", () => GlobalIdScalar)
    { id: solicitationCodeId }: GlobalId
  ): Promise<ConcreteResult<typeof VoidScalar>> {
    const result =
      await this.fundraisingEntryRepository.assignSolitationCodeToTeam(
        { uuid: teamId },
        {
          uuid: solicitationCodeId,
        }
      );

    return result.map(() => VoidScalar);
  }

  @AccessControlAuthorized(globalFundraisingAccessParam)
  @Mutation(() => VoidResolver, { name: "removeSolicitationCodeFromTeam" })
  async removeSolicitationCodeFromTeam(
    @Arg("teamId", () => GlobalIdScalar) { id: teamId }: GlobalId
  ): Promise<ConcreteResult<typeof VoidScalar>> {
    const result =
      await this.fundraisingEntryRepository.removeSolicitationCodeFromTeam({
        uuid: teamId,
      });

    return result.map(() => VoidScalar);
  }
}

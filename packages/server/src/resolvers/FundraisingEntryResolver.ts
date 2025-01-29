import { Container, Service } from "@freshgum/typedi";
import {
  assertGlobalId,
  CreateFundraisingEntryInput,
  CrudResolver,
  type GlobalId,
  SetFundraisingEntryInput,
} from "@ukdanceblue/common";
import {
  AccessControlAuthorized,
  DailyDepartmentNotificationNode,
  FundraisingAssignmentNode,
  FundraisingEntryNode,
  GlobalIdScalar,
  SolicitationCodeNode,
} from "@ukdanceblue/common";
import {
  ListFundraisingEntriesArgs,
  ListFundraisingEntriesResponse,
} from "@ukdanceblue/common";
import {
  ConcreteResult,
  InvariantError,
  NotFoundError,
} from "@ukdanceblue/common/error";
import { DateTime } from "luxon";
import { AsyncResult, Err, Ok, Option } from "ts-results-es";
import {
  Arg,
  Args,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";

import { WithAuditLogging } from "#lib/logging/auditLogging.js";
import { dailyDepartmentNotificationModelToResource } from "#repositories/dailyDepartmentNotification/ddnModelToResource.js";
import { fundraisingAssignmentModelToNode } from "#repositories/fundraising/fundraisingAssignmentModelToNode.js";
import { fundraisingEntryModelToNode } from "#repositories/fundraising/fundraisingEntryModelToNode.js";
import { FundraisingEntryRepository } from "#repositories/fundraising/FundraisingRepository.js";
import { MarathonRepository } from "#repositories/marathon/MarathonRepository.js";
import type { AsyncRepositoryResult } from "#repositories/shared.js";
import { SolicitationCodeRepository } from "#repositories/solicitationCode/SolicitationCodeRepository.js";

@Resolver(() => FundraisingEntryNode)
@Service([FundraisingEntryRepository, SolicitationCodeRepository])
export class FundraisingEntryResolver
  implements
    CrudResolver<FundraisingEntryNode, "fundraisingEntry", "fundraisingEntries">
{
  constructor(
    private readonly fundraisingEntryRepository: FundraisingEntryRepository,
    private readonly solicitationCodeRepository: SolicitationCodeRepository
  ) {}

  @AccessControlAuthorized("get", ["getId", "FundraisingEntryNode", "id"])
  @Query(() => FundraisingEntryNode)
  async fundraisingEntry(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<ConcreteResult<FundraisingEntryNode>> {
    const entry = await this.fundraisingEntryRepository.findEntryByUnique({
      uuid: id,
    });
    return entry.toAsyncResult().map(fundraisingEntryModelToNode).promise;
  }

  @AccessControlAuthorized("list", ["every", "FundraisingEntryNode"])
  @Query(() => ListFundraisingEntriesResponse)
  fundraisingEntries(
    @Args(() => ListFundraisingEntriesArgs) args: ListFundraisingEntriesArgs,
    solicitationCodeId?: GlobalId
  ): AsyncRepositoryResult<ListFundraisingEntriesResponse> {
    return this.fundraisingEntryRepository
      .findAndCount({
        filters: args.filters,
        limit: args.limit,
        offset: args.offset,
        solicitationCode:
          solicitationCodeId?.id != null
            ? {
                uuid: solicitationCodeId.id,
              }
            : null,
        search: args.search,
        sortBy: args.sortBy,
      })
      .map(({ selectedRows, total }) => ({
        data: selectedRows.map(fundraisingEntryModelToNode),
        total,
      }));
  }

  @AccessControlAuthorized<"TeamNode">(
    "list",
    (_info, _args, root) => {
      if (!root) {
        return Err(new InvariantError("Root is required"));
      }
      const { id: fundraisingEntryId } = root;
      const solicitationCodeRepository = Container.get(
        SolicitationCodeRepository
      );
      const marathonRepository = Container.get(MarathonRepository);
      return assertGlobalId(fundraisingEntryId)
        .toAsyncResult()
        .andThen(
          ({ id }) =>
            new AsyncResult(
              solicitationCodeRepository.getSolicitationCodeForEntry({
                uuid: id,
              })
            )
        )
        .andThen((solicitationCode) => {
          return new AsyncResult(marathonRepository.findActiveMarathon())
            .andThen((marathon) =>
              marathon.toResult(new NotFoundError("Active Marathon"))
            )
            .map((marathon) => ({
              marathonId: marathon.id,
              solicitationCodeId: solicitationCode.id,
            }));
        })
        .andThen(
          ({ marathonId, solicitationCodeId }) =>
            new AsyncResult(
              solicitationCodeRepository.getTeamsForSolitationCode(
                { id: solicitationCodeId },
                {
                  marathonParam: { id: marathonId },
                }
              )
            )
        )
        .map((teams) => ({
          kind: "TeamNode",
          id: teams.map(({ uuid }) => uuid),
        }));
    },
    ".fundraisingAssignments"
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

  @WithAuditLogging()
  @AccessControlAuthorized("create", ["every", "FundraisingEntryNode"])
  @Mutation(() => FundraisingEntryNode, { name: "createFundraisingEntry" })
  createFundraisingEntry(
    @Arg("input", () => CreateFundraisingEntryInput)
    input: CreateFundraisingEntryInput
  ): AsyncRepositoryResult<FundraisingEntryNode> {
    return this.fundraisingEntryRepository
      .create({
        init: {
          amount: input.amount,
          batchType: input.batchType,
          donatedBy: input.donatedBy ?? null,
          donatedOn: input.donatedOn ?? null,
          donatedTo: input.donatedTo ?? null,
          notes: input.notes ?? null,
          solicitationCode: {
            uuid: input.solicitationCodeId.id,
          },
        },
      })
      .map(fundraisingEntryModelToNode);
  }

  @WithAuditLogging()
  @AccessControlAuthorized("update", ["getId", "FundraisingEntryNode", "id"])
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
      await this.solicitationCodeRepository.getSolicitationCodeForEntry({
        uuid,
      });
    return new AsyncResult(solicitationCode).map((solicitationCode) =>
      SolicitationCodeNode.init({
        id: solicitationCode.uuid,
        prefix: solicitationCode.prefix,
        code: solicitationCode.code,
        name: solicitationCode.name,
        createdAt: DateTime.fromJSDate(solicitationCode.createdAt),
        updatedAt: DateTime.fromJSDate(solicitationCode.updatedAt),
      })
    ).promise;
  }
}

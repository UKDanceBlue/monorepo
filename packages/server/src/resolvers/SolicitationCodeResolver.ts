import { Service } from "@freshgum/typedi";
import {
  AccessControlAuthorized,
  CreateSolicitationCodeInput,
  CrudResolver,
  type GlobalId,
  GlobalIdScalar,
  ListFundraisingEntriesArgs,
  ListFundraisingEntriesResponse,
  ListSolicitationCodesArgs,
  ListSolicitationCodesResponse,
  SetSolicitationCodeInput,
  SolicitationCodeNode,
  TeamNode,
  VoidScalar,
} from "@ukdanceblue/common";
import { ConcreteResult } from "@ukdanceblue/common/error";
import { VoidResolver } from "graphql-scalars";
import { DateTime } from "luxon";
import { AsyncResult } from "ts-results-es";
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
import { solicitationCodeModelToNode } from "#repositories/fundraising/fundraisingEntryModelToNode.js";
import type { AsyncRepositoryResult } from "#repositories/shared.js";
import { SolicitationCodeRepository } from "#repositories/solicitationCode/SolicitationCodeRepository.js";
import { teamModelToResource } from "#repositories/team/teamModelToResource.js";

import { FundraisingEntryResolver } from "./FundraisingEntryResolver.js";

@Resolver(() => SolicitationCodeNode)
@Service([FundraisingEntryResolver, SolicitationCodeRepository])
export class SolicitationCodeResolver
  implements CrudResolver<SolicitationCodeNode, "solicitationCode">
{
  constructor(
    private readonly fundraisingEntryResolver: FundraisingEntryResolver,
    private readonly solicitationCodeRepository: SolicitationCodeRepository
  ) {}

  @AccessControlAuthorized("get", ["getId", "SolicitationCodeNode", "id"])
  @Query(() => SolicitationCodeNode)
  async solicitationCode(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<ConcreteResult<SolicitationCodeNode>> {
    const code =
      await this.solicitationCodeRepository.findSolicitationCodeByUnique({
        uuid: id,
      });
    return code.toAsyncResult().map(({ uuid, id, ...code }) =>
      SolicitationCodeNode.init({
        ...code,
        id: uuid,
        createdAt: DateTime.fromJSDate(code.createdAt),
        updatedAt: DateTime.fromJSDate(code.updatedAt),
      })
    ).promise;
  }

  @AccessControlAuthorized("list", ["every", "SolicitationCodeNode"])
  @Query(() => ListSolicitationCodesResponse)
  async solicitationCodes(
    @Args(() => ListSolicitationCodesArgs) args: ListSolicitationCodesArgs
  ): Promise<ConcreteResult<ListSolicitationCodesResponse>> {
    return this.solicitationCodeRepository
      .findAndCount({
        filters: args.filters,
        limit: args.limit,
        offset: args.offset,
        search: args.search,
        sortBy: args.sortBy,
      })
      .map(({ selectedRows, total }) => ({
        data: selectedRows.map(solicitationCodeModelToNode),
        total,
      })).promise;
  }

  @AccessControlAuthorized("create", ["every", "SolicitationCodeNode"])
  @Mutation(() => SolicitationCodeNode)
  @WithAuditLogging()
  createSolicitationCode(
    @Arg("input") { prefix, code, name }: CreateSolicitationCodeInput
  ): Promise<ConcreteResult<SolicitationCodeNode>> {
    return new AsyncResult(
      this.solicitationCodeRepository.createSolicitationCode({
        prefix,
        code,
        name,
      })
    ).map(({ id: _, uuid, ...code }) =>
      SolicitationCodeNode.init({
        id: uuid,
        ...code,
        createdAt: DateTime.fromJSDate(code.createdAt),
        updatedAt: DateTime.fromJSDate(code.updatedAt),
      })
    ).promise;
  }

  @AccessControlAuthorized("update", ["getId", "SolicitationCodeNode", "id"])
  @Mutation(() => SolicitationCodeNode)
  @WithAuditLogging()
  setSolicitationCode(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId,
    @Arg("input") { name }: SetSolicitationCodeInput
  ): Promise<ConcreteResult<SolicitationCodeNode>> {
    return new AsyncResult(
      this.solicitationCodeRepository.setSolicitationCode(
        { uuid: id },
        { name }
      )
    ).map(({ id: _, uuid, ...code }) =>
      SolicitationCodeNode.init({
        id: uuid,
        ...code,
        createdAt: DateTime.fromJSDate(code.createdAt),
        updatedAt: DateTime.fromJSDate(code.updatedAt),
      })
    ).promise;
  }

  @AccessControlAuthorized("list", ["every", "FundraisingEntryNode"])
  @FieldResolver(() => ListFundraisingEntriesResponse)
  entries(
    @Root() { id }: SolicitationCodeNode,
    @Args(() => ListFundraisingEntriesArgs) args: ListFundraisingEntriesArgs
  ): AsyncRepositoryResult<ListFundraisingEntriesResponse> {
    return this.fundraisingEntryResolver.fundraisingEntries(args, id);
  }

  @AccessControlAuthorized("list", ["every", "TeamNode"])
  @FieldResolver(() => [TeamNode])
  async teams(
    @Root() { id: { id } }: SolicitationCodeNode,
    @Arg("marathonId", () => GlobalIdScalar, { nullable: true })
    marathonId: GlobalId | null
  ): Promise<ConcreteResult<TeamNode[]>> {
    const teams =
      await this.solicitationCodeRepository.getTeamsForSolitationCode(
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

  @AccessControlAuthorized("update", ["getId", "SolicitationCodeNode", "id"])
  @Mutation(() => VoidResolver, { name: "assignSolicitationCodeToTeam" })
  @WithAuditLogging()
  async assignSolicitationCodeToTeam(
    @Arg("teamId", () => GlobalIdScalar) { id: teamId }: GlobalId,
    @Arg("id", () => GlobalIdScalar)
    { id: solicitationCodeId }: GlobalId
  ): Promise<ConcreteResult<typeof VoidScalar>> {
    const result =
      await this.solicitationCodeRepository.assignSolitationCodeToTeam(
        { uuid: teamId },
        {
          uuid: solicitationCodeId,
        }
      );

    return result.map(() => VoidScalar);
  }

  @AccessControlAuthorized("update", ["getId", "SolicitationCodeNode", "id"])
  @Mutation(() => VoidResolver, { name: "removeSolicitationCodeFromTeam" })
  @WithAuditLogging()
  async removeSolicitationCodeFromTeam(
    @Arg("teamId", () => GlobalIdScalar) { id: teamId }: GlobalId
  ): Promise<ConcreteResult<typeof VoidScalar>> {
    const result =
      await this.solicitationCodeRepository.removeSolicitationCodeFromTeam({
        uuid: teamId,
      });

    return result.map(() => VoidScalar);
  }
}

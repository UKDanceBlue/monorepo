import { Service } from "@freshgum/typedi";
import {
  AccessControlAuthorized,
  CrudResolver,
  type GlobalId,
  GlobalIdScalar,
  ListFundraisingEntriesArgs,
  ListFundraisingEntriesResponse,
  SolicitationCodeNode,
  TeamNode,
  VoidScalar,
} from "@ukdanceblue/common";
import { ConcreteResult } from "@ukdanceblue/common/error";
import { VoidResolver } from "graphql-scalars";
import {
  Arg,
  Args,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";

import { FundraisingEntryRepository } from "#repositories/fundraising/FundraisingRepository.js";
import { SolicitationCodeRepository } from "#repositories/solicitationCode/SolicitationCodeRepository.js";
import { teamModelToResource } from "#repositories/team/teamModelToResource.js";

import { globalFundraisingAccessParam } from "./accessParams.js";
import { FundraisingEntryResolver } from "./FundraisingEntryResolver.js";

@Resolver(() => SolicitationCodeNode)
@Service([
  FundraisingEntryRepository,
  FundraisingEntryResolver,
  SolicitationCodeRepository,
])
export class SolicitationCodeResolver
  implements CrudResolver<SolicitationCodeNode, "solicitationCode">
{
  constructor(
    private readonly fundraisingEntryResolver: FundraisingEntryResolver,
    private readonly solicitationCodeRepository: SolicitationCodeRepository
  ) {}

  @AccessControlAuthorized(globalFundraisingAccessParam)
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
      })
    ).promise;
  }

  @AccessControlAuthorized(globalFundraisingAccessParam)
  @Query(() => [SolicitationCodeNode])
  async solicitationCodes(): Promise<ConcreteResult<SolicitationCodeNode[]>> {
    const codes =
      await this.solicitationCodeRepository.findAllSolicitationCodes();
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

  @AccessControlAuthorized(globalFundraisingAccessParam)
  @Mutation(() => VoidResolver, { name: "assignSolicitationCodeToTeam" })
  async assignSolicitationCodeToTeam(
    @Arg("teamId", () => GlobalIdScalar) { id: teamId }: GlobalId,
    @Arg("solicitationCode", () => GlobalIdScalar)
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

  @AccessControlAuthorized(globalFundraisingAccessParam)
  @Mutation(() => VoidResolver, { name: "removeSolicitationCodeFromTeam" })
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

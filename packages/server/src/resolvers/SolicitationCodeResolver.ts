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

import { SolicitationCodeRepository } from "#repositories/solicitationCode/SolicitationCodeRepository.js";

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

  @AccessControlAuthorized("get")
  @Query(() => SolicitationCodeNode)
  async solicitationCode(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId
  ): AsyncResult<SolicitationCodeNode, ConcreteError> {
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

  @AccessControlAuthorized("get")
  @Query(() => ListSolicitationCodesResponse)
  async solicitationCodes(
    @Args(() => ListSolicitationCodesArgs) _query: ListSolicitationCodesArgs
  ): AsyncResult<ListSolicitationCodesResponse, ConcreteError> {
    const codes =
      await this.solicitationCodeRepository.findAllSolicitationCodes();
    return codes.toAsyncResult().map((codes) =>
      ListSolicitationCodesResponse.newPaginated({
        data: codes.map(({ uuid, id, ...code }) =>
          SolicitationCodeNode.init({
            ...code,
            id: uuid,
          })
        ),
        total: codes.length,
      })
    ).promise;
  }

  @AccessControlAuthorized("create")
  @Mutation(() => SolicitationCodeNode)
  createSolicitationCode(
    @Arg("input") { prefix, code, name }: CreateSolicitationCodeInput
  ): AsyncResult<SolicitationCodeNode, ConcreteError> {
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
      })
    ).promise;
  }

  @AccessControlAuthorized("update")
  @Mutation(() => SolicitationCodeNode)
  setSolicitationCode(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId,
    @Arg("input") { name }: SetSolicitationCodeInput
  ): AsyncResult<SolicitationCodeNode, ConcreteError> {
    return new AsyncResult(
      this.solicitationCodeRepository.setSolicitationCode(
        { uuid: id },
        { name }
      )
    ).map(({ id: _, uuid, ...code }) =>
      SolicitationCodeNode.init({
        id: uuid,
        ...code,
      })
    ).promise;
  }

  @AccessControlAuthorized("list", "FundraisingEntryNode")
  @FieldResolver(() => ListFundraisingEntriesResponse)
  async entries(
    @Root() { id }: SolicitationCodeNode,
    @Args(() => ListFundraisingEntriesArgs) args: ListFundraisingEntriesArgs
  ): AsyncResult<ListFundraisingEntriesResponse, ConcreteError> {
    return this.fundraisingEntryResolver.fundraisingEntries(args, id);
  }

  @AccessControlAuthorized("list", "TeamNode")
  @FieldResolver(() => [TeamNode])
  async teams(
    @Root() { id: { id } }: SolicitationCodeNode,
    @Arg("marathonId", () => GlobalIdScalar, { nullable: true })
    marathonId: GlobalId | null
  ): AsyncResult<TeamNode[], ConcreteError> {
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

  @AccessControlAuthorized("update", "SolicitationCodeNode")
  @Mutation(() => VoidResolver, { name: "assignSolicitationCodeToTeam" })
  async assignSolicitationCodeToTeam(
    @Arg("teamId", () => GlobalIdScalar) { id: teamId }: GlobalId,
    @Arg("solicitationCode", () => GlobalIdScalar)
    { id: solicitationCodeId }: GlobalId
  ): AsyncResult<typeof VoidScalar, ConcreteError> {
    const result =
      await this.solicitationCodeRepository.assignSolitationCodeToTeam(
        { uuid: teamId },
        {
          uuid: solicitationCodeId,
        }
      );

    return result.map(() => VoidScalar);
  }

  @AccessControlAuthorized("update", "SolicitationCodeNode")
  @Mutation(() => VoidResolver, { name: "removeSolicitationCodeFromTeam" })
  async removeSolicitationCodeFromTeam(
    @Arg("teamId", () => GlobalIdScalar) { id: teamId }: GlobalId
  ): AsyncResult<typeof VoidScalar, ConcreteError> {
    const result =
      await this.solicitationCodeRepository.removeSolicitationCodeFromTeam({
        uuid: teamId,
      });

    return result.map(() => VoidScalar);
  }
}

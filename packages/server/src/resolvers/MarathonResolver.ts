import { Service } from "@freshgum/typedi";
import type { CrudResolver, GlobalId } from "@ukdanceblue/common";
import {
  AccessControlAuthorized,
  CommitteeIdentifier,
  GlobalIdScalar,
  MarathonHourNode,
  MarathonNode,
  TeamNode,
} from "@ukdanceblue/common";
import {
  CreateMarathonInput,
  ListMarathonsArgs,
  ListMarathonsResponse,
  SetMarathonInput,
} from "@ukdanceblue/common";
import { ConcreteResult } from "@ukdanceblue/common/error";
import { AsyncResult, Option } from "ts-results-es";
import {
  Arg,
  Args,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";

import { CommitteeRepository } from "#repositories/committee/CommitteeRepository.js";
import { marathonModelToResource } from "#repositories/marathon/marathonModelToResource.js";
import { MarathonRepository } from "#repositories/marathon/MarathonRepository.js";
import { marathonHourModelToResource } from "#repositories/marathonHour/marathonHourModelToResource.js";
import { teamModelToResource } from "#repositories/team/teamModelToResource.js";

@Resolver(() => MarathonNode)
@Service([MarathonRepository, CommitteeRepository])
export class MarathonResolver
  implements
    Record<
      `${CommitteeIdentifier}Team`,
      (marathon: MarathonNode) => Promise<ConcreteResult<TeamNode>>
    >,
    CrudResolver<MarathonNode, "marathon">
{
  constructor(
    private readonly marathonRepository: MarathonRepository,
    private readonly committeeRepository: CommitteeRepository
  ) {}
  allMarathons?:
    | ((
        ...args: never[]
      ) =>
        | MarathonNode[]
        | Promise<MarathonNode[]>
        | Promise<ConcreteResult<MarathonNode[]>>
        | ConcreteResult<MarathonNode[]>)
    | undefined;
  getMultipleMarathons?:
    | ((
        ids: GlobalId[],
        ...args: never[]
      ) =>
        | MarathonNode[]
        | Promise<MarathonNode[]>
        | Promise<ConcreteResult<MarathonNode[]>>
        | ConcreteResult<MarathonNode[]>)
    | undefined;
  createMarathons?:
    | ((
        createArgs: never[],
        ...args: never[]
      ) =>
        | MarathonNode[]
        | Promise<MarathonNode[]>
        | Promise<ConcreteResult<MarathonNode[]>>
        | ConcreteResult<MarathonNode[]>)
    | undefined;
  deleteMarathons?:
    | ((
        ids: GlobalId[],
        ...args: never[]
      ) =>
        | MarathonNode[]
        | Promise<MarathonNode[]>
        | Promise<ConcreteResult<MarathonNode[]>>
        | ConcreteResult<MarathonNode[]>)
    | undefined;
  setMarathons?:
    | ((
        setArgs: { id: GlobalId; set: never }[],
        ...args: never[]
      ) =>
        | MarathonNode[]
        | Promise<MarathonNode[]>
        | Promise<ConcreteResult<MarathonNode[]>>
        | ConcreteResult<MarathonNode[]>)
    | undefined;
  set?: undefined;
  get?: undefined;
  getByUuid?: undefined;
  update?: undefined;
  create?: undefined;
  delete?: undefined;
  list?: undefined;
  listMarathons?: undefined;

  @AccessControlAuthorized("get")
  @Query(() => MarathonNode)
  async marathon(@Arg("id", () => GlobalIdScalar) { id }: GlobalId) {
    const marathon = await this.marathonRepository.findOne({
      by: {
        uuid: id,
      },
    }).promise;
    return marathon.map(marathonModelToResource);
  }

  @AccessControlAuthorized("get")
  @Query(() => MarathonNode)
  async marathonForYear(@Arg("year") year: string) {
    const marathon = await this.marathonRepository.findOne({
      by: {
        year,
      },
    }).promise;
    return marathon.map(marathonModelToResource);
  }

  @AccessControlAuthorized("list", "MarathonNode")
  @Query(() => ListMarathonsResponse)
  async marathons(@Args() args: ListMarathonsArgs) {
    return this.marathonRepository
      .findAndCount({
        param: args,
      })
      .map(({ selectedRows, total }) =>
        ListMarathonsResponse.newPaginated({
          data: selectedRows.map(marathonModelToResource),
          total,
        })
      ).promise;
  }

  @AccessControlAuthorized("readActive")
  @Query(() => MarathonNode, {
    nullable: true,
    description:
      "The marathon that is currently happening, i.e. the marathon with the latest start date that has not yet ended.",
  })
  async currentMarathon(): Promise<ConcreteResult<Option<MarathonNode>>> {
    const marathon = await this.marathonRepository.findCurrentMarathon();
    return marathon.map((m) => m.map(marathonModelToResource));
  }

  @AccessControlAuthorized("readActive")
  @Query(() => MarathonNode, {
    nullable: true,
    description:
      "The most recent marathon, regardless of whether it is currently happening, i.e. the marathon with the latest year.",
  })
  async latestMarathon(): Promise<ConcreteResult<Option<MarathonNode>>> {
    const marathon = await this.marathonRepository.findActiveMarathon();
    return marathon.map((m) => m.map(marathonModelToResource));
  }

  @AccessControlAuthorized("create")
  @Mutation(() => MarathonNode)
  async createMarathon(@Arg("input") input: CreateMarathonInput) {
    return this.marathonRepository
      .create({ init: input })
      .andThen(async (marathon) => {
        const result = await this.committeeRepository.ensureCommittees([
          { id: marathon.id },
        ]);
        return result.map(() => marathonModelToResource(marathon));
      }).promise;
  }

  @AccessControlAuthorized("update")
  @Mutation(() => MarathonNode)
  async setMarathon(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId,
    @Arg("input") input: SetMarathonInput
  ) {
    return this.marathonRepository
      .update({
        by: { uuid: id },
        init: input,
      })
      .map(marathonModelToResource).promise;
  }

  @AccessControlAuthorized("delete")
  @Mutation(() => MarathonNode)
  deleteMarathon(@Arg("id", () => GlobalIdScalar) { id }: GlobalId) {
    return this.marathonRepository
      .delete({ by: { uuid: id } })
      .map(marathonModelToResource).promise;
  }

  @AccessControlAuthorized("list", "MarathonNode")
  @FieldResolver(() => [MarathonHourNode])
  async hours(@Root() { id: { id } }: MarathonNode) {
    return new AsyncResult(
      this.marathonRepository.getMarathonHours({
        uuid: id,
      })
    ).map((hours) => hours.map(marathonHourModelToResource)).promise;
  }

  async #committeeTeam(
    committee: CommitteeIdentifier,
    { id: { id } }: MarathonNode
  ) {
    const result = await this.committeeRepository.getCommitteeTeam(committee, {
      uuid: id,
    });
    return result.map(teamModelToResource);
  }

  // Committees
  @FieldResolver(() => TeamNode)
  async communityDevelopmentCommitteeTeam(marathon: MarathonNode) {
    return this.#committeeTeam(
      CommitteeIdentifier.communityDevelopmentCommittee,
      marathon
    );
  }

  @FieldResolver(() => TeamNode)
  async programmingCommitteeTeam(marathon: MarathonNode) {
    return this.#committeeTeam(
      CommitteeIdentifier.programmingCommittee,
      marathon
    );
  }

  @FieldResolver(() => TeamNode)
  async fundraisingCommitteeTeam(marathon: MarathonNode) {
    return this.#committeeTeam(
      CommitteeIdentifier.fundraisingCommittee,
      marathon
    );
  }

  @FieldResolver(() => TeamNode)
  async dancerRelationsCommitteeTeam(marathon: MarathonNode) {
    return this.#committeeTeam(
      CommitteeIdentifier.dancerRelationsCommittee,
      marathon
    );
  }

  @FieldResolver(() => TeamNode)
  async familyRelationsCommitteeTeam(marathon: MarathonNode) {
    return this.#committeeTeam(
      CommitteeIdentifier.familyRelationsCommittee,
      marathon
    );
  }

  @FieldResolver(() => TeamNode)
  async techCommitteeTeam(marathon: MarathonNode) {
    return this.#committeeTeam(CommitteeIdentifier.techCommittee, marathon);
  }

  @FieldResolver(() => TeamNode)
  async operationsCommitteeTeam(marathon: MarathonNode) {
    return this.#committeeTeam(
      CommitteeIdentifier.operationsCommittee,
      marathon
    );
  }

  @FieldResolver(() => TeamNode)
  async marketingCommitteeTeam(marathon: MarathonNode) {
    return this.#committeeTeam(
      CommitteeIdentifier.marketingCommittee,
      marathon
    );
  }

  @FieldResolver(() => TeamNode)
  async corporateCommitteeTeam(marathon: MarathonNode) {
    return this.#committeeTeam(
      CommitteeIdentifier.corporateCommittee,
      marathon
    );
  }

  @FieldResolver(() => TeamNode)
  async miniMarathonsCommitteeTeam(marathon: MarathonNode) {
    return this.#committeeTeam(
      CommitteeIdentifier.miniMarathonsCommittee,
      marathon
    );
  }

  @FieldResolver(() => TeamNode)
  async viceCommitteeTeam(marathon: MarathonNode) {
    return this.#committeeTeam(CommitteeIdentifier.viceCommittee, marathon);
  }

  @FieldResolver(() => TeamNode)
  async overallCommitteeTeam(marathon: MarathonNode) {
    return this.#committeeTeam(CommitteeIdentifier.overallCommittee, marathon);
  }
}

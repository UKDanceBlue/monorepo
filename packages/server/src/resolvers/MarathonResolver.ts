import { Service } from "@freshgum/typedi";
import type { CrudResolver, GlobalId } from "@ukdanceblue/common";
import {
  AccessControlAuthorized,
  CommitteeIdentifier,
  GlobalIdScalar,
  MarathonHourNode,
  MarathonNode,
  SortDirection,
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
    const marathon = await this.marathonRepository.findMarathonByUnique({
      uuid: id,
    });
    return marathon.map(marathonModelToResource);
  }

  @AccessControlAuthorized("get")
  @Query(() => MarathonNode)
  async marathonForYear(@Arg("year") year: string) {
    const marathon = await this.marathonRepository.findMarathonByUnique({
      year,
    });
    return marathon.map(marathonModelToResource);
  }

  @AccessControlAuthorized("list", "MarathonNode")
  @Query(() => ListMarathonsResponse)
  async marathons(@Args() args: ListMarathonsArgs) {
    const marathons = await this.marathonRepository.listMarathons({
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
    });
    const marathonCount = await this.marathonRepository.countMarathons({
      filters: args.filters,
    });
    return ListMarathonsResponse.newPaginated({
      data: marathons.map(marathonModelToResource),
      total: marathonCount,
      page: args.page,
      pageSize: args.actualPageSize,
    });
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

  @AccessControlAuthorized("get")
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
    return new AsyncResult(
      this.marathonRepository.createMarathon(input)
    ).andThen(async (marathon) => {
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
    const marathon = await this.marathonRepository.updateMarathon(
      { uuid: id },
      input
    );
    return marathon.map(marathonModelToResource);
  }

  @AccessControlAuthorized("delete")
  @Mutation(() => MarathonNode)
  async deleteMarathon(@Arg("id", () => GlobalIdScalar) { id }: GlobalId) {
    const marathon = await this.marathonRepository.deleteMarathon({ uuid: id });
    return marathon.map(marathonModelToResource);
  }

  @AccessControlAuthorized("list", "MarathonNode")
  @FieldResolver(() => [MarathonHourNode])
  async hours(@Root() { id: { id } }: MarathonNode) {
    const rows = await this.marathonRepository.getMarathonHours({
      uuid: id,
    });
    return rows.map((hours) => hours.map(marathonHourModelToResource));
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

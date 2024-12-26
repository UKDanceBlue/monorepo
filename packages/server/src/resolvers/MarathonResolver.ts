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
import { type ConcreteError } from "@ukdanceblue/common/error";
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
import {
  mapToResource,
  mapToResources,
} from "#repositories/DefaultRepository.js";
import { MarathonRepository } from "#repositories/marathon/MarathonRepository.js";

@Resolver(() => MarathonNode)
@Service([MarathonRepository, CommitteeRepository])
export class MarathonResolver
  implements
    Record<
      `${CommitteeIdentifier}Team`,
      (marathon: MarathonNode) => AsyncResult<TeamNode, ConcreteError>
    >,
    CrudResolver<MarathonNode, "marathon">
{
  constructor(
    private readonly marathonRepository: MarathonRepository,
    private readonly committeeRepository: CommitteeRepository
  ) {}

  @AccessControlAuthorized("get")
  @Query(() => MarathonNode)
  marathon(@Arg("id", () => GlobalIdScalar) { id }: GlobalId) {
    const marathon = this.marathonRepository.findOne({
      by: {
        uuid: id,
      },
    });
    return marathon.map(mapToResource);
  }

  @AccessControlAuthorized("get")
  @Query(() => MarathonNode)
  marathonForYear(@Arg("year") year: string) {
    const marathon = this.marathonRepository.findOne({
      by: {
        year,
      },
    });
    return marathon.map(mapToResource);
  }

  @AccessControlAuthorized("list", "MarathonNode")
  @Query(() => ListMarathonsResponse)
  marathons(@Args() args: ListMarathonsArgs) {
    return this.marathonRepository
      .findAndCount({
        param: args,
      })
      .map(({ selectedRows, total }) =>
        ListMarathonsResponse.newPaginated({
          data: selectedRows.map(mapToResource),
          total,
        })
      );
  }

  @AccessControlAuthorized("readActive")
  @Query(() => MarathonNode, {
    nullable: true,
    description:
      "The marathon that is currently happening, i.e. the marathon with the latest start date that has not yet ended.",
  })
  currentMarathon(): AsyncResult<MarathonNode, ConcreteError> {
    const marathon = this.marathonRepository.findCurrentMarathon();
    return marathon.map(mapToResource);
  }

  @AccessControlAuthorized("readActive")
  @Query(() => MarathonNode, {
    nullable: true,
    description:
      "The most recent marathon, regardless of whether it is currently happening, i.e. the marathon with the latest year.",
  })
  latestMarathon(): AsyncResult<MarathonNode, ConcreteError> {
    const marathon = this.marathonRepository.findActiveMarathon();
    return marathon.map(mapToResource);
  }

  @AccessControlAuthorized("create")
  @Mutation(() => MarathonNode)
  createMarathon(@Arg("input") input: CreateMarathonInput) {
    return this.marathonRepository
      .create({ init: input })
      .andThen((marathon) => {
        const result = new AsyncResult(
          this.committeeRepository.ensureCommittees([{ id: marathon.row.id }])
        );
        return result.map(() => marathon.toResource());
      });
  }

  @AccessControlAuthorized("update")
  @Mutation(() => MarathonNode)
  setMarathon(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId,
    @Arg("input") input: SetMarathonInput
  ) {
    return this.marathonRepository
      .update({
        by: { uuid: id },
        init: input,
      })
      .map(mapToResource);
  }

  @AccessControlAuthorized("delete")
  @Mutation(() => MarathonNode)
  deleteMarathon(@Arg("id", () => GlobalIdScalar) { id }: GlobalId) {
    return this.marathonRepository
      .delete({ by: { uuid: id } })
      .map(mapToResource);
  }

  @AccessControlAuthorized("list", "MarathonNode")
  @FieldResolver(() => [MarathonHourNode])
  hours(@Root() { id: { id } }: MarathonNode) {
    return new AsyncResult(
      this.marathonRepository.getMarathonHours({
        uuid: id,
      })
    ).map((hours) => hours.map(marathonHourModelToResource));
  }

  #committeeTeam(committee: CommitteeIdentifier, { id: { id } }: MarathonNode) {
    const result = new AsyncResult(
      this.committeeRepository.getCommitteeTeam(committee, {
        uuid: id,
      })
    );
    // TODO: Map to resource
    return result;
  }

  // Committees
  @FieldResolver(() => TeamNode)
  communityDevelopmentCommitteeTeam(marathon: MarathonNode) {
    return this.#committeeTeam(
      CommitteeIdentifier.communityDevelopmentCommittee,
      marathon
    );
  }

  @FieldResolver(() => TeamNode)
  programmingCommitteeTeam(marathon: MarathonNode) {
    return this.#committeeTeam(
      CommitteeIdentifier.programmingCommittee,
      marathon
    );
  }

  @FieldResolver(() => TeamNode)
  fundraisingCommitteeTeam(marathon: MarathonNode) {
    return this.#committeeTeam(
      CommitteeIdentifier.fundraisingCommittee,
      marathon
    );
  }

  @FieldResolver(() => TeamNode)
  dancerRelationsCommitteeTeam(marathon: MarathonNode) {
    return this.#committeeTeam(
      CommitteeIdentifier.dancerRelationsCommittee,
      marathon
    );
  }

  @FieldResolver(() => TeamNode)
  familyRelationsCommitteeTeam(marathon: MarathonNode) {
    return this.#committeeTeam(
      CommitteeIdentifier.familyRelationsCommittee,
      marathon
    );
  }

  @FieldResolver(() => TeamNode)
  techCommitteeTeam(marathon: MarathonNode) {
    return this.#committeeTeam(CommitteeIdentifier.techCommittee, marathon);
  }

  @FieldResolver(() => TeamNode)
  operationsCommitteeTeam(marathon: MarathonNode) {
    return this.#committeeTeam(
      CommitteeIdentifier.operationsCommittee,
      marathon
    );
  }

  @FieldResolver(() => TeamNode)
  marketingCommitteeTeam(marathon: MarathonNode) {
    return this.#committeeTeam(
      CommitteeIdentifier.marketingCommittee,
      marathon
    );
  }

  @FieldResolver(() => TeamNode)
  corporateCommitteeTeam(marathon: MarathonNode) {
    return this.#committeeTeam(
      CommitteeIdentifier.corporateCommittee,
      marathon
    );
  }

  @FieldResolver(() => TeamNode)
  miniMarathonsCommitteeTeam(marathon: MarathonNode) {
    return this.#committeeTeam(
      CommitteeIdentifier.miniMarathonsCommittee,
      marathon
    );
  }

  @FieldResolver(() => TeamNode)
  viceCommitteeTeam(marathon: MarathonNode) {
    return this.#committeeTeam(CommitteeIdentifier.viceCommittee, marathon);
  }

  @FieldResolver(() => TeamNode)
  overallCommitteeTeam(marathon: MarathonNode) {
    return this.#committeeTeam(CommitteeIdentifier.overallCommittee, marathon);
  }
}

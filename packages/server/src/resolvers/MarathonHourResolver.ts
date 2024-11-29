import { Service } from "@freshgum/typedi";
import { CommitteeRole } from "@prisma/client";
import type { GlobalId } from "@ukdanceblue/common";
import {
  AccessControlAuthorized,
  AccessLevel,
  CommitteeIdentifier,
  GlobalIdScalar,
  ImageNode,
  LegacyError,
  LegacyErrorCode,
  MarathonHourNode,
} from "@ukdanceblue/common";
import {
  CreateMarathonHourInput,
  ListMarathonHoursArgs,
  ListMarathonHoursResponse,
  SetMarathonHourInput,
} from "@ukdanceblue/common";
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

import { marathonHourModelToResource } from "#repositories/marathonHour/marathonHourModelToResource.js";
import { MarathonHourRepository } from "#repositories/marathonHour/MarathonHourRepository.js";

@Resolver(() => MarathonHourNode)
@Service([MarathonHourRepository])
export class MarathonHourResolver {
  constructor(
    private readonly marathonHourRepository: MarathonHourRepository
  ) {}

  @AccessControlAuthorized({
    accessLevel: AccessLevel.Public,
  })
  @Query(() => MarathonHourNode)
  async marathonHour(@Arg("uuid", () => GlobalIdScalar) { id }: GlobalId) {
    const marathonHour =
      await this.marathonHourRepository.findMarathonHourByUnique({
        uuid: id,
      });
    if (marathonHour == null) {
      throw new LegacyError(LegacyErrorCode.NotFound, "MarathonHour not found");
    }
    return marathonHourModelToResource(marathonHour);
  }

  @AccessControlAuthorized({
    accessLevel: AccessLevel.Public,
  })
  @Query(() => MarathonHourNode, { nullable: true })
  async currentMarathonHour() {
    const marathonHour =
      await this.marathonHourRepository.findCurrentMarathonHour();
    if (marathonHour == null) {
      return null;
    }
    return marathonHourModelToResource(marathonHour);
  }

  // TODO: Double check that this access is correct
  @AccessControlAuthorized({
    accessLevel: AccessLevel.Committee,
  })
  @Query(() => ListMarathonHoursResponse)
  async marathonHours(@Args() args: ListMarathonHoursArgs) {
    const marathons = await this.marathonHourRepository.listMarathonHours(args);
    const marathonCount =
      await this.marathonHourRepository.countMarathonHours(args);
    return ListMarathonHoursResponse.newPaginated({
      data: marathons.map(marathonHourModelToResource),
      total: marathonCount,
      page: args.page,
      pageSize: args.actualPageSize,
    });
  }

  @AccessControlAuthorized({
    accessLevel: AccessLevel.Public,
  })
  @FieldResolver(() => [ImageNode])
  async mapImages(@Root() { id: { id } }: MarathonHourNode) {
    return this.marathonHourRepository.getMaps({ uuid: id });
  }

  @AccessControlAuthorized(
    {
      accessLevel: AccessLevel.Admin,
    },
    {
      authRules: [
        {
          minCommitteeRole: CommitteeRole.Coordinator,
          committeeIdentifier: CommitteeIdentifier.programmingCommittee,
        },
      ],
    }
  )
  @Mutation(() => MarathonHourNode)
  async createMarathonHour(
    @Arg("input") input: CreateMarathonHourInput,
    @Arg("marathonUuid", () => GlobalIdScalar) marathonUuid: GlobalId
  ) {
    const marathonHour = await this.marathonHourRepository.createMarathonHour({
      ...input,
      marathon: { uuid: marathonUuid.id },
    });
    return marathonHourModelToResource(marathonHour);
  }

  @AccessControlAuthorized(
    {
      accessLevel: AccessLevel.Admin,
    },
    {
      authRules: [
        {
          minCommitteeRole: CommitteeRole.Coordinator,
          committeeIdentifier: CommitteeIdentifier.programmingCommittee,
        },
      ],
    }
  )
  @Mutation(() => MarathonHourNode)
  async setMarathonHour(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId,
    @Arg("input") input: SetMarathonHourInput
  ) {
    const marathonHour = await this.marathonHourRepository.updateMarathonHour(
      { uuid: id },
      input
    );
    if (marathonHour == null) {
      throw new LegacyError(LegacyErrorCode.NotFound, "MarathonHour not found");
    }
    return marathonHourModelToResource(marathonHour);
  }

  @AccessControlAuthorized(
    {
      accessLevel: AccessLevel.Admin,
    },
    {
      authRules: [
        {
          minCommitteeRole: CommitteeRole.Coordinator,
          committeeIdentifier: CommitteeIdentifier.programmingCommittee,
        },
      ],
    }
  )
  @Mutation(() => VoidResolver)
  async deleteMarathonHour(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId
  ) {
    const marathonHour = await this.marathonHourRepository.deleteMarathonHour({
      uuid: id,
    });
    if (marathonHour == null) {
      throw new LegacyError(LegacyErrorCode.NotFound, "MarathonHour not found");
    }
  }

  @AccessControlAuthorized(
    {
      accessLevel: AccessLevel.Admin,
    },
    {
      authRules: [
        {
          minCommitteeRole: CommitteeRole.Coordinator,
          committeeIdentifier: CommitteeIdentifier.programmingCommittee,
        },
      ],
    }
  )
  @Mutation(() => MarathonHourNode)
  async addMap(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId,
    @Arg("imageUuid", () => GlobalIdScalar) imageUuid: GlobalId
  ) {
    const marathonHour = await this.marathonHourRepository.addMap(
      { uuid: id },
      { uuid: imageUuid.id }
    );
    if (marathonHour == null) {
      throw new LegacyError(LegacyErrorCode.NotFound, "MarathonHour not found");
    }
    return marathonHourModelToResource(marathonHour);
  }

  @AccessControlAuthorized(
    {
      accessLevel: AccessLevel.Admin,
    },
    {
      authRules: [
        {
          minCommitteeRole: CommitteeRole.Coordinator,
          committeeIdentifier: CommitteeIdentifier.programmingCommittee,
        },
      ],
    }
  )
  @Mutation(() => VoidResolver)
  async removeMap(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId,
    @Arg("imageUuid", () => GlobalIdScalar) imageUuid: GlobalId
  ) {
    const marathonHour = await this.marathonHourRepository.removeMap(
      { uuid: id },
      { uuid: imageUuid.id }
    );
    if (marathonHour == null) {
      throw new LegacyError(LegacyErrorCode.NotFound, "MarathonHour not found");
    }
  }
}

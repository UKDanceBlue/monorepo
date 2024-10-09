import { MarathonHourRepository } from "#repositories/marathonHour/MarathonHourRepository.js";
import { marathonHourModelToResource } from "#repositories/marathonHour/marathonHourModelToResource.js";

import {
  LegacyError,
  LegacyErrorCode,
  GlobalIdScalar,
  ImageNode,
  MarathonHourNode,
  AccessLevel,
  MutationAccessControl,
  CommitteeIdentifier,
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
import { Service } from "@freshgum/typedi";

import type { GlobalId } from "@ukdanceblue/common";
import {
  ListMarathonHoursResponse,
  ListMarathonHoursArgs,
  CreateMarathonHourInput,
  SetMarathonHourInput,
} from "@ukdanceblue/common";
import { CommitteeRole } from "@prisma/client";

@Resolver(() => MarathonHourNode)
@Service([MarathonHourRepository])
export class MarathonHourResolver {
  constructor(
    private readonly marathonHourRepository: MarathonHourRepository
  ) {}

  @MutationAccessControl({
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

  @MutationAccessControl({
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
  @MutationAccessControl({
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

  @MutationAccessControl({
    accessLevel: AccessLevel.Public,
  })
  @FieldResolver(() => [ImageNode])
  async mapImages(@Root() { id: { id } }: MarathonHourNode) {
    return this.marathonHourRepository.getMaps({ uuid: id });
  }

  @MutationAccessControl(
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

  @MutationAccessControl(
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

  @MutationAccessControl(
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

  @MutationAccessControl(
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

  @MutationAccessControl(
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

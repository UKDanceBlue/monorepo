import { Prisma, PrismaClient } from "@prisma/client";
import {
  CommitteeIdentifier,
  CommitteeRole,
  DetailedError,
  ErrorCode,
  SortDirection,
} from "@ukdanceblue/common";
import { Service } from "typedi";

import type { FilterItems } from "../../lib/prisma-utils/gqlFilterToPrismaFilter.js";
import type { UniqueMarathonParam } from "../marathon/MarathonRepository.js";
import { MarathonRepository } from "../marathon/MarathonRepository.js";
import { MembershipRepository } from "../membership/MembershipRepository.js";
import type { SimpleUniqueParam } from "../shared.js";

import * as CommitteeDescriptions from "./committeeDescriptions.js";
import {
  buildCommitteeOrder,
  buildCommitteeWhere,
} from "./committeeRepositoryUtils.js";

// Make sure that we are exporting a description for every committee
CommitteeDescriptions[
  "" as CommitteeIdentifier
] satisfies Prisma.CommitteeUpsertWithoutChildCommitteesInput;

const CommitteeOneOfKeys = ["identifier"] as const;
type CommitteeOneOfKeys = (typeof CommitteeOneOfKeys)[number];

const CommitteeDateKeys = ["createdAt", "updatedAt"] as const;
type CommitteeDateKey = (typeof CommitteeDateKeys)[number];

export type CommitteeFilters = FilterItems<
  never,
  CommitteeDateKey,
  never,
  never,
  CommitteeOneOfKeys,
  never
>;

type CommitteeUniqueParam =
  | SimpleUniqueParam
  | { identifier: CommitteeIdentifier };

@Service()
export class CommitteeRepository {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly membershipRepository: MembershipRepository,
    private readonly marathonRepository: MarathonRepository
  ) {}

  // Finders

  findCommittees(
    filters: readonly CommitteeFilters[] | null | undefined,
    order: readonly [key: string, sort: SortDirection][] | null | undefined,
    limit?: number | undefined,
    offset?: number | undefined
  ) {
    const where = buildCommitteeWhere(filters);
    const orderBy = buildCommitteeOrder(order);

    return this.prisma.committee.findMany({
      where,
      orderBy,
      take: limit,
      skip: offset,
    });
  }

  findCommitteeByUnique(param: CommitteeUniqueParam) {
    return this.prisma.committee.findUnique({ where: param });
  }

  async assignPersonToCommittee(
    personParam: SimpleUniqueParam,
    committeeParam: CommitteeIdentifier,
    committeeRole: CommitteeRole,
    marathonParam?: UniqueMarathonParam
  ) {
    const person = await this.prisma.person.findUnique({ where: personParam });
    if (!person) {
      throw new DetailedError(ErrorCode.NotFound, "Person not found");
    }

    if (!marathonParam) {
      const latestMarathon = await this.marathonRepository.findActiveMarathon();
      if (!latestMarathon) {
        throw new DetailedError(
          ErrorCode.NotFound,
          "No upcoming marathon found and no marathon provided"
        );
      }
      marathonParam = { id: latestMarathon.id };
    } else {
      // Check if the marathon exists
      const val =
        await this.marathonRepository.findMarathonByUnique(marathonParam);
      if (!val) {
        throw new DetailedError(ErrorCode.NotFound, "Marathon not found");
      }
    }

    const committee = await this.getCommittee(committeeParam, {
      forMarathon: marathonParam,
    });

    for (const team of committee.correspondingTeams) {
      // eslint-disable-next-line no-await-in-loop
      await this.membershipRepository.assignPersonToTeam({
        personParam: { id: person.id },
        teamParam: { id: team.id },
        committeeRole,
      });
    }
  }

  // Mutators

  deleteCommittee(uuid: string) {
    try {
      return this.prisma.committee.delete({ where: { uuid } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return null;
      } else {
        throw error;
      }
    }
  }

  // Committee getter

  getCommittee(
    identifier: CommitteeIdentifier,
    opts: {
      forMarathon?: UniqueMarathonParam;
    } = {}
  ) {
    return this.prisma.committee.upsert({
      ...CommitteeDescriptions[identifier],
      where: { identifier },
      include: {
        correspondingTeams: opts.forMarathon
          ? {
              where: {
                marathon: opts.forMarathon,
              },
            }
          : undefined,
      },
    });
  }

  async getCommitteeTeam(
    committee: CommitteeIdentifier,
    marathon: UniqueMarathonParam
  ) {
    const result = await this.prisma.committee
      .findUnique({ where: { identifier: committee } })
      .correspondingTeams({
        where: {
          marathon,
        },
      });
    if (result?.length === 1) {
      return result[0];
    } else if (result?.length === 0) {
      throw new DetailedError(
        ErrorCode.NotFound,
        "No team found for the given committee and marathon"
      );
    } else {
      throw new DetailedError(
        ErrorCode.InternalFailure,
        "Multiple teams found for the given committee and marathon"
      );
    }
  }

  getChildCommittees(identifier: CommitteeUniqueParam) {
    return this.prisma.committee
      .findUnique({
        where: identifier,
      })
      .childCommittees();
  }

  getParentCommittee(identifier: CommitteeUniqueParam) {
    return this.prisma.committee
      .findUnique({
        where: identifier,
      })
      .parentCommittee();
  }
}

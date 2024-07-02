import { Committee, Prisma, PrismaClient, Team } from "@prisma/client";
import {
  CommitteeIdentifier,
  CommitteeRole,
  SortDirection,
} from "@ukdanceblue/common";
import { Err, None, Ok, Result } from "ts-results-es";
import { Service } from "typedi";

import { CompositeError } from "#error/composite.js";
import { InvariantError, NotFoundError } from "#error/direct.js";
import { toBasicError } from "#error/error.js";
import type { FilterItems } from "#lib/prisma-utils/gqlFilterToPrismaFilter.js";
import type { UniqueMarathonParam } from "../marathon/MarathonRepository.js";
import { MarathonRepository } from "../marathon/MarathonRepository.js";
import { MembershipRepository } from "../membership/MembershipRepository.js";
import {
  RepositoryError,
  SimpleUniqueParam,
  handleRepositoryError,
} from "../shared.js";

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

  async findCommittees(
    filters: readonly CommitteeFilters[] | null | undefined,
    order: readonly [key: string, sort: SortDirection][] | null | undefined,
    limit?: number | undefined,
    offset?: number | undefined
  ): Promise<Result<Committee[], RepositoryError>> {
    try {
      const where = buildCommitteeWhere(filters);
      const orderBy = buildCommitteeOrder(order);

      const committees = await this.prisma.committee.findMany({
        where,
        orderBy,
        take: limit,
        skip: offset,
      });

      return Ok(committees);
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  async findCommitteeByUnique(
    param: CommitteeUniqueParam
  ): Promise<Result<Committee | null, RepositoryError>> {
    try {
      const committee = await this.prisma.committee.findUnique({
        where: param,
      });
      return Ok(committee);
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  async assignPersonToCommittee(
    personParam: SimpleUniqueParam,
    committeeParam: CommitteeIdentifier,
    committeeRole: CommitteeRole,
    marathonParam?: UniqueMarathonParam
  ): Promise<Result<None, RepositoryError | CompositeError<RepositoryError>>> {
    try {
      const person = await this.prisma.person.findUnique({
        where: personParam,
      });
      if (!person) {
        return Err(new NotFoundError({ what: "Person" }));
      }

      if (!marathonParam) {
        const latestMarathon =
          await this.marathonRepository.findActiveMarathon();
        if (latestMarathon.isErr()) {
          return Err(latestMarathon.error);
        }
        marathonParam = { id: latestMarathon.value.id };
      } else {
        const val =
          await this.marathonRepository.findMarathonByUnique(marathonParam);
        if (val.isErr()) {
          return Err(val.error);
        }
      }

      const committee = await this.getCommittee(committeeParam, {
        forMarathon: marathonParam,
      });

      if (committee.isErr()) {
        return Err(committee.error);
      }

      // for (const team of committee.value.correspondingTeams) {
      //   // eslint-disable-next-line no-await-in-loop
      //   await this.membershipRepository.assignPersonToTeam({
      //     personParam: { id: person.id },
      //     teamParam: { id: team.id },
      //     committeeRole,
      //   });
      // }
      const results = await Promise.allSettled(
        committee.value.correspondingTeams.map((team) =>
          this.membershipRepository.assignPersonToTeam({
            personParam: { id: person.id },
            teamParam: { id: team.id },
            committeeRole,
          })
        )
      );

      const errors: RepositoryError[] = [];

      for (const result of results) {
        if (result.status === "fulfilled") {
          if (result.value.isErr()) {
            errors.push(result.value.error);
          }
        } else {
          errors.push(toBasicError(result.reason));
        }
      }

      if (errors.length > 0) {
        return Err(new CompositeError(errors));
      }

      return Ok(None);
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  // Mutators

  async deleteCommittee(uuid: string): Promise<Result<None, RepositoryError>> {
    try {
      await this.prisma.committee.delete({ where: { uuid } });
      return Ok(None);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return Err(new NotFoundError({ what: "Committee" }));
      } else {
        return handleRepositoryError(error);
      }
    }
  }

  // Committee getter

  async getCommittee(
    identifier: CommitteeIdentifier,
    opts: {
      forMarathon?: UniqueMarathonParam;
    } = {}
  ): Promise<
    Result<
      Committee & {
        correspondingTeams: Team[];
      },
      RepositoryError
    >
  > {
    try {
      const committee = await this.prisma.committee.upsert({
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

      return Ok(committee);
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  async getCommitteeTeam(
    committee: CommitteeIdentifier,
    marathon: UniqueMarathonParam
  ): Promise<Result<Team, RepositoryError | InvariantError>> {
    try {
      const result = await this.prisma.committee
        .findUnique({ where: { identifier: committee } })
        .correspondingTeams({
          where: {
            marathon,
          },
        });

      if (result?.length === 1) {
        return Ok(result[0]!);
      } else if (result?.length === 0) {
        return Err(
          new NotFoundError({
            what: "Team",
            where: `Committee: ${committee}, Marathon: ${JSON.stringify(marathon)}`,
          })
        );
      } else {
        return Err(
          new InvariantError(
            "Multiple teams found for the given committee and marathon"
          )
        );
      }
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  async getChildCommittees(
    identifier: CommitteeUniqueParam
  ): Promise<Result<Committee[], RepositoryError>> {
    try {
      const childCommittees = await this.prisma.committee
        .findUnique({
          where: identifier,
        })
        .childCommittees();
      if (!childCommittees) {
        return Err(new NotFoundError({ what: "Committee" }));
      }

      return Ok(childCommittees);
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  async getParentCommittee(
    identifier: CommitteeUniqueParam
  ): Promise<Result<Committee | null, RepositoryError>> {
    try {
      const parentCommittee = await this.prisma.committee
        .findUnique({
          where: identifier,
        })
        .parentCommittee();

      return Ok(parentCommittee);
    } catch (error) {
      return handleRepositoryError(error);
    }
  }
}

import { Service } from "@freshgum/typedi";
import { Committee, Prisma, PrismaClient, Team } from "@prisma/client";
import {
  CommitteeIdentifier,
  committeeNames,
  CommitteeRole,
  TeamLegacyStatus,
  TeamType,
} from "@ukdanceblue/common";
import {
  CompositeError,
  InvariantError,
  NotFoundError,
  toBasicError,
} from "@ukdanceblue/common/error";
import { AsyncResult, Err, None, Ok, Result } from "ts-results-es";

import type { UniqueMarathonParam } from "#repositories/marathon/MarathonRepository.js";
import { MarathonRepository } from "#repositories/marathon/MarathonRepository.js";
import { MembershipRepository } from "#repositories/membership/MembershipRepository.js";
import {
  handleRepositoryError,
  RepositoryError,
  SimpleUniqueParam,
} from "#repositories/shared.js";

import * as CommitteeDescriptions from "./committeeDescriptions.js";

// Make sure that we are exporting a description for every committee
CommitteeDescriptions[
  "" as CommitteeIdentifier
] satisfies Prisma.CommitteeUpsertWithoutChildCommitteesInput;

type CommitteeUniqueParam =
  | SimpleUniqueParam
  | { identifier: CommitteeIdentifier };

import { prismaToken } from "#lib/typediTokens.js";

@Service([prismaToken, MembershipRepository, MarathonRepository])
export class CommitteeRepository {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly membershipRepository: MembershipRepository,
    private readonly marathonRepository: MarathonRepository
  ) {}

  // Finders
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
        return Err(new NotFoundError("Person"));
      }

      if (!marathonParam) {
        const latestMarathon = await new AsyncResult(
          this.marathonRepository.findActiveMarathon()
        ).andThen((option) =>
          option.toResult(new NotFoundError("active marathon"))
        ).promise;
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
        withTeamForMarathon: marathonParam,
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
        committee.value.correspondingTeams?.map((team) =>
          this.membershipRepository.assignPersonToTeam({
            personParam: { id: person.id },
            teamParam: { id: team.id },
            committeeRole,
          })
        ) ?? []
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
        return Err(new NotFoundError("Committee"));
      } else {
        return handleRepositoryError(error);
      }
    }
  }

  // Committee getter

  async getCommittee(
    identifier: CommitteeIdentifier,
    opts: {
      withTeamForMarathon?: UniqueMarathonParam;
    } = {}
  ): Promise<
    Result<
      Committee & {
        correspondingTeams?: Team[];
      },
      RepositoryError
    >
  > {
    try {
      let committee:
        | (Committee & {
            correspondingTeams?: Team[];
          })
        | null = await this.prisma.committee.upsert({
        ...CommitteeDescriptions[identifier],
        where: { identifier },
      });

      await this.ensureCommitteeTeams(committee, [opts.withTeamForMarathon!]);

      committee = await this.prisma.committee.findUnique({
        where: { identifier },
        include: {
          correspondingTeams: opts.withTeamForMarathon
            ? {
                where: {
                  marathon: opts.withTeamForMarathon,
                },
              }
            : undefined,
        },
      });

      if (!committee) {
        return Err(new NotFoundError("Committee"));
      }

      return Ok(committee);
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  async ensureCommittees(
    marathons?: UniqueMarathonParam[]
  ): Promise<Result<None, RepositoryError>> {
    try {
      const { overallCommittee, viceCommittee, ...childCommittees } =
        CommitteeDescriptions;
      const overall = await this.prisma.committee.upsert(overallCommittee);
      if (marathons) {
        await this.ensureCommitteeTeams(overall, marathons);
      }
      const vice = await this.prisma.committee.upsert(viceCommittee);
      if (marathons) {
        await this.ensureCommitteeTeams(vice, marathons);
      }
      for (const committee of Object.values(childCommittees)) {
        // eslint-disable-next-line no-await-in-loop
        const child = await this.prisma.committee.upsert(committee);
        if (marathons) {
          // eslint-disable-next-line no-await-in-loop
          await this.ensureCommitteeTeams(child, marathons);
        }
      }

      return Ok(None);
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  async ensureCommitteeTeams(
    committee: { id: number; identifier: CommitteeIdentifier },
    marathons: UniqueMarathonParam[]
  ): Promise<Result<None, RepositoryError>> {
    try {
      for (const marathonParam of marathons) {
        const marathon =
          // eslint-disable-next-line no-await-in-loop
          await this.marathonRepository.findMarathonByUnique(marathonParam);

        if (marathon.isErr()) {
          return Err(marathon.error);
        }

        // eslint-disable-next-line no-await-in-loop
        await this.prisma.team.upsert({
          where: {
            marathonId_correspondingCommitteeId: {
              marathonId: marathon.value.id,
              correspondingCommitteeId: committee.id,
            },
          },
          create: {
            name: committeeNames[committee.identifier],
            type: TeamType.Spirit,
            legacyStatus: TeamLegacyStatus.ReturningTeam,
            correspondingCommittee: {
              connect: {
                id: committee.id,
              },
            },
            marathon: {
              connect: {
                id: marathon.value.id,
              },
            },
          },
          update: {
            name: committeeNames[committee.identifier],
            type: TeamType.Spirit,
            legacyStatus: TeamLegacyStatus.ReturningTeam,
          },
        });
      }

      return Ok(None);
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
          new NotFoundError(
            "Team",
            `Committee: ${committee}, Marathon: ${JSON.stringify(marathon)}`
          )
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
        return Err(new NotFoundError("Committee"));
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

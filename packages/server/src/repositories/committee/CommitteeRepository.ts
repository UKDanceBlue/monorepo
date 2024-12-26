import { Service } from "@freshgum/typedi";
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
import { eq } from "drizzle-orm";
import { AsyncResult, Err, None, Ok, Result } from "ts-results-es";

import { buildDefaultRepository } from "#repositories/DefaultRepository.js";
import type { UniqueMarathonParam } from "#repositories/marathon/MarathonRepository.js";
import { MarathonRepository } from "#repositories/marathon/MarathonRepository.js";
import { MembershipRepository } from "#repositories/membership/MembershipRepository.js";
import {
  handleRepositoryError,
  RepositoryError,
  SimpleUniqueParam,
} from "#repositories/shared.js";
import { committee, team } from "#schema/tables/team.sql.js";

import * as CommitteeDescriptions from "./committeeDescriptions.js";

// Make sure that we are exporting a description for every committee
"" as unknown as Omit<
  typeof CommitteeDescriptions,
  "CommitteeDescription"
> satisfies Record<
  CommitteeIdentifier,
  CommitteeDescriptions.CommitteeDescription
>;

type CommitteeFields = "identifier" | "createdAt" | "updatedAt";
const fieldLookup = {
  identifier: committee.identifier,
  createdAt: committee.createdAt,
  updatedAt: committee.updatedAt,
};

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

@Service([MembershipRepository, MarathonRepository])
export class CommitteeRepository extends buildDefaultRepository(
  committee,
  {},
  {} as CommitteeUniqueParam
) {
  constructor(
    private readonly membershipRepository: MembershipRepository,
    private readonly marathonRepository: MarathonRepository
  ) {
    super();
  }

  // Finders
  uniqueToWhere(by: CommitteeUniqueParam) {
    if ("id" in by) {
      return eq(committee.id, by.id);
    } else if ("uuid" in by) {
      return eq(committee.uuid, by.uuid);
    } else {
      return eq(committee.identifier, by.identifier);
    }
  }

  public findOneWithTeam(
    by: CommitteeUniqueParam,
    marathon?: UniqueMarathonParam
  ) {
    return this.handleQueryError(
      db.query.committee.findFirst({
        where: this.uniqueToWhere(by),
        with: {
          teams: {
            with: {
              marathon: true,
            },
            where: marathon
              ? this.marathonRepository.uniqueToWhere(marathon)
              : undefined,
          },
        },
      }),
      {
        where: "CommitteeRepository.findOne",
        sensitive: false,
      }
    );
  }

  async assignPersonToCommittee(
    personParam: SimpleUniqueParam,
    committeeParam: CommitteeUniqueParam,
    committeeRole: CommitteeRole,
    marathonParam?: UniqueMarathonParam
  ): Promise<Result<None, RepositoryError | CompositeError<RepositoryError>>> {
    try {
      const person = await this.findOne(personParam).promise;
      if (person.isErr()) {
        return person;
      }

      if (!marathonParam) {
        const latestMarathon = await new AsyncResult(
          this.marathonRepository.findActiveMarathon()
        ).andThen((option) =>
          option.toResult(new NotFoundError({ what: "active marathon" }))
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

      const committee = await this.findOneWithTeam(
        committeeParam,
        marathonParam
      ).promise;

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
        committee.value.teams.map((team) =>
          this.membershipRepository.assignPersonToTeam({
            personParam: { id: person.value.id },
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

  // Committee getters
  async ensureCommittees(
    marathons?: UniqueMarathonParam[]
  ): Promise<Result<None, RepositoryError>> {
    try {
      const { overallCommittee, viceCommittee, ...childCommittees } =
        CommitteeDescriptions;

      const overall = await this.handleQueryError(
        this.db
          .insert(committee)
          .values({
            identifier: CommitteeIdentifier.overallCommittee,
          })
          .onConflictDoNothing()
          .returning()
          .then((result) => result[0])
      ).andThen((committee) => {
        return committee
          ? Ok(committee)
          : this.findOne({ identifier: CommitteeIdentifier.overallCommittee });
      }).promise;
      if (overall.isErr()) {
        return overall;
      }

      const vice = await this.handleQueryError(
        this.db
          .insert(committee)
          .values({
            identifier: CommitteeIdentifier.viceCommittee,
            parentCommitteeId: overall.value.id,
          })
          .onConflictDoNothing()
          .returning()
          .then((result) => result[0])
      ).andThen((committee) => {
        return committee
          ? Ok(committee)
          : this.findOne({ identifier: CommitteeIdentifier.viceCommittee });
      }).promise;
      if (vice.isErr()) {
        return vice;
      }

      const result = await this.handleQueryError(
        this.db
          .insert(committee)
          .values(
            Object.values(childCommittees).map((committee) => ({
              ...committee,
              parentCommitteeId:
                committee.parentIdentifier ===
                CommitteeIdentifier.overallCommittee
                  ? overall.value.id
                  : committee.parentIdentifier ===
                      CommitteeIdentifier.viceCommittee
                    ? vice.value.id
                    : undefined,
            }))
          )
          .onConflictDoNothing()
          .returning()
      ).promise;

      if (result.isErr()) {
        return result;
      }

      if (marathons) {
        return Result.all(
          await Promise.all(
            [overall.value, vice.value, ...result.value].map((committee) =>
              this.ensureCommitteeTeams(committee, marathons)
            )
          )
        ).map(() => None);
      } else {
        return Ok(None);
      }
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  async ensureCommitteeTeams(
    committee: { id: number; identifier: CommitteeIdentifier },
    marathons: UniqueMarathonParam[]
  ): Promise<Result<None, RepositoryError>> {
    try {
      const results: Promise<Result<unknown, RepositoryError>>[] = [];
      for (const marathonParam of marathons) {
        const marathon =
          // eslint-disable-next-line no-await-in-loop
          await this.marathonRepository.findMarathonByUnique(marathonParam);

        if (marathon.isErr()) {
          return Err(marathon.error);
        }

        results.push(
          this.handleQueryError(
            db
              .insert(team)
              .values({
                name: committeeNames[committee.identifier],
                type: TeamType.Spirit,
                legacyStatus: TeamLegacyStatus.ReturningTeam,
                correspondingCommitteeId: committee.id,
                marathonId: marathon.value.id,
              })
              .onConflictDoNothing()
          ).promise
        );
      }

      return Result.all(await Promise.all(results)).map(() => None);
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
        return Ok(result[0]);
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

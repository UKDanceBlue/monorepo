import { Service } from "@freshgum/typedi";
import type { Person, Prisma, TeamWithMeta } from "@prisma/client";
import { asyncResultAll, batchMap, Report } from "@ukdanceblue/common";
import { None, Ok, type Option } from "ts-results-es";

import { PrismaService } from "#lib/prisma.js";
import { PersonRepository } from "#repositories/person/PersonRepository.js";
import type { AsyncRepositoryResult } from "#repositories/shared.js";

import { TeamRepository } from "./TeamRepository.js";

@Service([PrismaService, TeamRepository, PersonRepository])
export class FundraisingReportRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly teamRepository: TeamRepository,
    private readonly personRepository: PersonRepository
  ) {}

  public async pointTotalsPerTeam(baseWhere: Prisma.TeamWhereInput) {
    const data = await this.prisma.pointEntry.groupBy({
      where: {
        team: baseWhere,
      },
      by: ["teamId"],
      _sum: {
        points: true,
      },
    });

    const teamCache = new Map<number, Option<TeamWithMeta>>();
    return batchMap(
      data,
      (
        val
      ): AsyncRepositoryResult<
        readonly [team: Option<TeamWithMeta>, points: number]
      > => {
        if (teamCache.has(val.teamId)) {
          return Ok([
            teamCache.get(val.teamId)!,
            val._sum.points ?? 0,
          ] as const).toAsyncResult();
        }
        return this.teamRepository
          .findOne({ by: { id: val.teamId } })
          .map((team) => {
            teamCache.set(val.teamId, team);
            return [team, val._sum.points ?? 0] as const;
          });
      }
    ).map((teams) =>
      Report.fromJson(
        ["Team Name", "Total Points"],
        [
          {
            title: "Summary",
            data: teams.map(([team, points]) => ({
              "Team Name": team.map((team) => team.name).unwrapOr("Unknown"),
              "Total Points": points,
            })),
          },
        ]
      )
    );
  }

  public async pointTotalsPerPersonByTeam(baseWhere: Prisma.TeamWhereInput) {
    const data = await this.prisma.pointEntry.groupBy({
      where: {
        team: baseWhere,
      },
      by: ["teamId", "personFromId"],
      _sum: {
        points: true,
      },
      orderBy: [
        {
          teamId: "asc",
        },
        {
          personFromId: "asc",
        },
      ],
    });

    const teamCache = new Map<number, Option<TeamWithMeta>>();
    const personCache = new Map<number, Option<Person>>();
    return batchMap(
      data,
      (
        val
      ): AsyncRepositoryResult<
        readonly [
          team: Option<TeamWithMeta>,
          person: Option<Person>,
          points: number,
        ]
      > => {
        if (
          teamCache.has(val.teamId) &&
          (val.personFromId == null || personCache.has(val.personFromId))
        ) {
          const cachedTeam = teamCache.get(val.teamId)!;
          const cachedPerson =
            val.personFromId != null
              ? personCache.get(val.personFromId)!
              : None;

          return Ok([
            cachedTeam,
            cachedPerson,
            val._sum.points ?? 0,
          ] as const).toAsyncResult();
        }
        return asyncResultAll(
          this.teamRepository
            .findOne({ by: { id: val.teamId } })
            .map((team) => {
              teamCache.set(val.teamId, team);
              return team;
            }),
          val.personFromId
            ? this.personRepository
                .findOne({ by: { id: val.personFromId } })
                .map((person) => {
                  personCache.set(val.personFromId!, person);
                  return person;
                })
            : Ok(None).toAsyncResult(),
          Ok(val._sum.points ?? 0).toAsyncResult()
        );
      }
    ).map((teams) =>
      Report.fromJson(
        ["Team Name", "Person", "Total Points"],
        [
          {
            title: "Summary",
            data: teams.map(([team, person, points]) => ({
              "Team Name": team.map((val) => val.name).unwrapOr("Unknown"),
              "Person": person.map((val) => val.name).unwrapOr("Unknown"),
              "Total Points": points,
            })),
          },
        ]
      )
    );
  }
}

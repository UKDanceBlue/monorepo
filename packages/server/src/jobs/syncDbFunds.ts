import { Container, Service } from "@freshgum/typedi";
import type { Marathon, PrismaClient } from "@prisma/client";
import type { MarathonYearString } from "@ukdanceblue/common";
import { type ConcreteError, NotFoundError } from "@ukdanceblue/common/error";
import { CompositeError } from "@ukdanceblue/common/error";
import { AsyncResult, Err, None, Ok, type Result } from "ts-results-es";

import {
  DBFundsFundraisingProvider,
  type DBFundsFundraisingProviderError,
} from "#lib/fundraising/DbFundsProvider.js";
import { prismaToken } from "#lib/typediTokens.js";
import { logger } from "#logging/standardLogging.js";
import { DBFundsRepository } from "#repositories/fundraising/DBFundsRepository.js";
import { JobStateRepository } from "#repositories/JobState.js";
import { MarathonRepository } from "#repositories/marathon/MarathonRepository.js";
import type { RepositoryError } from "#repositories/shared.js";

import { Job } from "./Job.js";

async function doSyncForMarathon(
  marathon: Marathon,
  fundraisingProvider: DBFundsFundraisingProvider,
  fundraisingRepository: DBFundsRepository,
  prisma: PrismaClient
): Promise<Result<None, ConcreteError>> {
  const teams = await fundraisingProvider.getTeams(
    marathon.year as MarathonYearString
  );
  if (teams.isErr()) {
    return Err(teams.error);
  }
  logger.trace("Got teams for DBFunds sync", {
    teamCount: teams.value.length,
  });

  const results = [];

  for (const team of teams.value) {
    // eslint-disable-next-line no-await-in-loop
    const entries = await fundraisingProvider.getTeamEntries(
      marathon.year as MarathonYearString,
      team.identifier
    );
    if (entries.isErr()) {
      results.push(entries);
      continue;
    }
    results.push(
      // eslint-disable-next-line no-await-in-loop
      await fundraisingRepository.overwriteTeamForFiscalYear(
        {
          active: team.active,
          dbNum: team.identifier,
          name: team.name,
          total: team.total,
        },
        { id: marathon.id },
        entries.value
      )
    );
  }

  const errors: (RepositoryError | DBFundsFundraisingProviderError)[] = [];
  for (const result of results) {
    if (result.isErr()) {
      if (result.error instanceof CompositeError) {
        errors.push(...result.error.errors);
      } else {
        errors.push(result.error);
      }
    }
  }

  logger.trace("Associating teams with identical names");
  const teamNames = new Map<string, number>();
  teams.value.forEach((team) => {
    teamNames.set(team.name, team.identifier);
  });
  await Promise.all(
    teamNames.entries().map(async ([name, dbNum]) => {
      const team = await prisma.team.findFirst({
        where: {
          name,
          marathonId: marathon.id,
          dbFundsTeamId: null,
        },
      });
      if (team) {
        return prisma.team.update({
          where: { id: team.id },
          data: {
            solicitationCode: {
              connectOrCreate: {
                where: {
                  prefix_code: {
                    code: dbNum,
                    prefix: "DB",
                  },
                },
                create: {
                  code: dbNum,
                  prefix: "DB",
                },
              },
            },
          },
        });
      } else {
        return null;
      }
    })
  );

  return errors.length > 0 ? Err(new CompositeError(errors)) : Ok(None);
}

@Service([
  JobStateRepository,
  MarathonRepository,
  DBFundsRepository,
  DBFundsFundraisingProvider,
  prismaToken,
])
export class SyncDbFundsJob extends Job {
  constructor(
    protected readonly jobStateRepository: JobStateRepository,
    protected readonly marathonRepository: MarathonRepository,
    protected readonly fundraisingRepository: DBFundsRepository,
    protected readonly fundraisingProvider: DBFundsFundraisingProvider,
    protected readonly prisma: PrismaClient
  ) {
    super("0 */30 * * * *", "sync-db-funds");
  }

  protected async run(): Promise<void> {
    logger.info("Syncing DBFunds");
    const result = await this.doSyncForActive();

    result.unwrap();
  }

  async doSyncForActive(): Promise<Result<None, ConcreteError>> {
    const marathonRepository = Container.get(MarathonRepository);

    const activeMarathon = await new AsyncResult(
      marathonRepository.findActiveMarathon()
    ).andThen((activeMarathon) =>
      activeMarathon.toResult(new NotFoundError({ what: "active marathon" }))
    ).promise;
    if (activeMarathon.isErr()) {
      return activeMarathon;
    }
    logger.trace("Found current marathon for DBFunds sync", activeMarathon);

    return doSyncForMarathon(
      activeMarathon.value,
      this.fundraisingProvider,
      this.fundraisingRepository,
      this.prisma
    );
  }
}

@Service([
  JobStateRepository,
  MarathonRepository,
  DBFundsRepository,
  DBFundsFundraisingProvider,
  prismaToken,
])
export class SyncDbFundsPastJob extends Job {
  constructor(
    protected readonly jobStateRepository: JobStateRepository,
    protected readonly marathonRepository: MarathonRepository,
    protected readonly fundraisingRepository: DBFundsRepository,
    protected readonly fundraisingProvider: DBFundsFundraisingProvider,
    protected readonly prisma: PrismaClient
  ) {
    super("0 0 */2 * * *", "sync-db-funds-past");
  }

  protected async run(): Promise<void> {
    logger.info("Syncing DBFunds for past marathons");
    const result = await this.doSyncForPastMarathons();

    result.unwrap();
  }

  async doSyncForPastMarathons(): Promise<Result<None, ConcreteError>> {
    const marathonRepository = Container.get(MarathonRepository);

    const activeMarathon = await new AsyncResult(
      marathonRepository.findActiveMarathon()
    ).andThen((activeMarathon) =>
      activeMarathon.toResult(new NotFoundError({ what: "active marathon" }))
    ).promise;
    if (activeMarathon.isErr()) {
      return activeMarathon;
    }

    const allMarathons = await marathonRepository.findAndCount({}).promise;

    if (allMarathons.isErr()) {
      return allMarathons;
    }

    const pastMarathons = allMarathons.value.selectedRows.filter(
      (marathon) => marathon.id !== activeMarathon.value.id
    );

    for (const marathon of pastMarathons) {
      // eslint-disable-next-line no-await-in-loop
      const result = await doSyncForMarathon(
        marathon,
        this.fundraisingProvider,
        this.fundraisingRepository,
        this.prisma
      );
      if (result.isErr()) {
        return result;
      }
    }

    return Ok(None);
  }
}

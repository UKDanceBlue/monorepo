import type { MarathonYearString } from "@ukdanceblue/common";
import { NotFoundError } from "@ukdanceblue/common/error";

const jobStateRepository = Container.get(JobStateRepository);

import { Container } from "@freshgum/typedi";
import type { Marathon } from "@prisma/client";
import { CompositeError } from "@ukdanceblue/common/error";
import { Cron } from "croner";
import { AsyncResult, Err, None, Ok, type Result } from "ts-results-es";

import type { PrismaError } from "#error/prisma.js";
import {
  DBFundsFundraisingProvider,
  type DBFundsFundraisingProviderError,
} from "#lib/fundraising/DbFundsProvider.js";
import { prismaToken } from "#lib/typediTokens.js";
import { logger } from "#logging/standardLogging.js";
import { DBFundsRepository } from "#repositories/fundraising/DBFundsRepository.js";
import { JobStateRepository } from "#repositories/JobState.js";
import { MarathonRepository } from "#repositories/marathon/MarathonRepository.js";

type DoSyncError =
  | NotFoundError
  | PrismaError
  | DBFundsFundraisingProviderError;

async function doSyncForActive(): Promise<
  Result<None, DoSyncError | CompositeError<DoSyncError>>
> {
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

  return doSyncForMarathon(activeMarathon.value);
}

async function doSyncForPastMarathons(): Promise<
  Result<None, DoSyncError | CompositeError<DoSyncError>>
> {
  const marathonRepository = Container.get(MarathonRepository);

  const activeMarathon = await new AsyncResult(
    marathonRepository.findActiveMarathon()
  ).andThen((activeMarathon) =>
    activeMarathon.toResult(new NotFoundError({ what: "active marathon" }))
  ).promise;
  if (activeMarathon.isErr()) {
    return activeMarathon;
  }

  const allMarathons = await marathonRepository.listMarathons({});

  const pastMarathons = allMarathons.filter(
    (marathon) => marathon.id !== activeMarathon.value.id
  );

  for (const marathon of pastMarathons) {
    // eslint-disable-next-line no-await-in-loop
    const result = await doSyncForMarathon(marathon);
    if (result.isErr()) {
      return result;
    }
  }

  return Ok(None);
}

async function doSyncForMarathon(
  marathon: Marathon
): Promise<Result<None, DoSyncError | CompositeError<DoSyncError>>> {
  const fundraisingRepository = Container.get(DBFundsRepository);
  const fundraisingProvider = Container.get(DBFundsFundraisingProvider);
  const prisma = Container.get(prismaToken);

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

  const errors: DoSyncError[] = [];
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

export const syncDbFunds = new Cron(
  "0 */30 * * * *",
  {
    name: "sync-db-funds",
    paused: true,
    catch: (error) => {
      logger.error("Failed to sync DBFunds", { error });
    },
  },
  async () => {
    logger.info("Syncing DBFunds");
    const result = await doSyncForActive();

    if (result.isErr()) {
      logger.error("Failed to sync DBFunds", result.error);
    } else {
      logger.info("DBFunds sync complete");
      await jobStateRepository.logCompletedJob(syncDbFunds);
    }
  }
);

export const syncDbFundsPast = new Cron(
  "0 0 */2 * * *",
  {
    name: "sync-db-funds-past",
    paused: true,
    catch: (error) => {
      logger.error("Failed to sync DBFunds for past marathons", { error });
    },
  },
  async () => {
    logger.info("Syncing DBFunds for past marathons");
    const result = await doSyncForPastMarathons();

    if (result.isErr()) {
      logger.error("Failed to sync DBFunds for past marathons", result.error);
    } else {
      logger.info("DBFunds past marathons sync complete");
      await jobStateRepository.logCompletedJob(syncDbFundsPast);
    }
  }
);

syncDbFunds.options.startAt =
  await jobStateRepository.getNextJobDate(syncDbFunds);
syncDbFunds.resume();

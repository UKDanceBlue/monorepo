import type { MarathonYearString } from "@ukdanceblue/common";
import { NotFoundError } from "@ukdanceblue/common/error";

const jobStateRepository = Container.get(JobStateRepository);

import { Container } from "@freshgum/typedi";
import type { Marathon } from "@prisma/client";
import { CompositeError, toBasicError } from "@ukdanceblue/common/error";
import { Cron } from "croner";
import { AsyncResult, Err, None, Ok, type Result } from "ts-results-es";

import type { PrismaError } from "#error/prisma.js";
import {
  DBFundsFundraisingProvider,
  type DBFundsFundraisingProviderError,
} from "#lib/fundraising/DbFundsProvider.js";
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

  const teams = await fundraisingProvider.getTeams(
    marathon.year as MarathonYearString
  );
  if (teams.isErr()) {
    return Err(teams.error);
  }
  logger.trace("Got teams for DBFunds sync", {
    teamCount: teams.value.length,
  });

  const promises = teams.value.map(async (team) => {
    const entries = await fundraisingProvider.getTeamEntries(
      marathon.year as MarathonYearString,
      team.identifier
    );
    if (entries.isErr()) {
      return Err(entries.error);
    }
    return fundraisingRepository.overwriteTeamForFiscalYear(
      {
        active: team.active,
        dbNum: team.identifier,
        name: team.name,
        total: team.total,
      },
      { id: marathon.id },
      entries.value
    );
  });

  const results = await Promise.allSettled(promises);

  const errors: DoSyncError[] = [];
  for (const result of results) {
    if (result.status === "rejected") {
      errors.push(toBasicError(result.reason));
    } else if (result.value.isErr()) {
      if (result.value.error instanceof CompositeError) {
        errors.push(...result.value.error.errors);
      } else {
        errors.push(result.value.error);
      }
    }
  }

  return errors.length > 0 ? Err(new CompositeError(errors)) : Ok(None);
}

export const syncDbFunds = new Cron(
  "0 */30 * * * *",
  {
    name: "sync-db-funds",
    paused: true,
    catch: (error) => {
      console.error("Failed to sync DBFunds", error);
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
  "0 0 2 * * *",
  {
    name: "sync-db-funds-past",
    paused: true,
    catch: (error) => {
      console.error("Failed to sync DBFunds for past marathons", error);
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
// eslint-disable-next-line unicorn/prefer-top-level-await
syncDbFunds.trigger().catch((error: unknown) => {
  console.error("Failed to trigger syncDbFunds", error);
});

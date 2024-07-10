import type { MarathonYearString } from "@ukdanceblue/common";
import type { NotFoundError } from "@ukdanceblue/common/error";
import { CompositeError, toBasicError } from "@ukdanceblue/common/error";
import Cron from "croner";
import { Err, None, Ok, type Result } from "ts-results-es";
import { Container } from "typedi";
const jobStateRepository = Container.get(JobStateRepository);

import type { PrismaError } from "#error/prisma.js";
import {
  DBFundsFundraisingProvider,
  type DBFundsFundraisingProviderError,
} from "#lib/fundraising/DbFundsProvider.js";
import { logger } from "#logging/standardLogging.js";
import { JobStateRepository } from "#repositories/JobState.js";
import { DBFundsRepository } from "#repositories/fundraising/DBFundsRepository.js";
import { MarathonRepository } from "#repositories/marathon/MarathonRepository.js";

type DoSyncError =
  | NotFoundError
  | PrismaError
  | DBFundsFundraisingProviderError;
async function doSync(): Promise<
  Result<None, DoSyncError | CompositeError<DoSyncError>>
> {
  const marathonRepository = Container.get(MarathonRepository);
  const fundraisingRepository = Container.get(DBFundsRepository);
  const fundraisingProvider = Container.get(DBFundsFundraisingProvider);
  const activeMarathon = await marathonRepository.findActiveMarathon();
  logger.trace("Found current marathon for DBFunds sync", activeMarathon);
  if (activeMarathon.isErr()) {
    return activeMarathon;
  }
  const teams = await fundraisingProvider.getTeams(
    activeMarathon.value.year as MarathonYearString
  );
  if (teams.isErr()) {
    return Err(teams.error);
  }
  logger.trace("Got teams for DBFunds sync", { teamCount: teams.value.length });

  const promises = teams.value.map(async (team) => {
    const entries = await fundraisingProvider.getTeamEntries(
      activeMarathon.value.year as MarathonYearString,
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
      { id: activeMarathon.value.id },
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
  "0 */11 * * * *",
  {
    name: "sync-db-funds",
    paused: true,
    catch: (error) => {
      console.error("Failed to sync DBFunds", error);
    },
  },
  async () => {
    logger.info("Syncing DBFunds");
    const result = await doSync();

    if (result.isErr()) {
      logger.error("Failed to sync DBFunds", result.error);
    } else {
      logger.info("DBFunds sync complete");
      await jobStateRepository.logCompletedJob(syncDbFunds);
    }
  }
);

syncDbFunds.options.startAt =
  await jobStateRepository.getNextJobDate(syncDbFunds);
syncDbFunds.resume();

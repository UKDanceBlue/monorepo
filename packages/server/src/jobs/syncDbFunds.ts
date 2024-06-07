import type { Marathon } from "@prisma/client";
import type { MarathonYearString } from "@ukdanceblue/common";
import Cron from "croner";
import { Result, type Unit } from "true-myth";
import { Container } from "typedi";

import { CompositeError } from "../lib/error/composite.js";
import { NotFoundError } from "../lib/error/direct.js";
import { toBasicError } from "../lib/error/error.js";
import type { PrismaError } from "../lib/error/prisma.js";
import { toPrismaError } from "../lib/error/prisma.js";
import {
  DBFundsFundraisingProvider,
  type DBFundsFundraisingProviderError,
} from "../lib/fundraising/DbFundsProvider.js";
import { logger } from "../lib/logging/standardLogging.js";
import { DBFundsRepository } from "../repositories/fundraising/DBFundsRepository.js";
import { MarathonRepository } from "../repositories/marathon/MarathonRepository.js";

type DoSyncError =
  | NotFoundError
  | PrismaError
  | DBFundsFundraisingProviderError;
async function doSync(): Promise<
  Result<Unit, DoSyncError | CompositeError<DoSyncError>>
> {
  const marathonRepository = Container.get(MarathonRepository);
  const fundraisingRepository = Container.get(DBFundsRepository);
  const fundraisingProvider = Container.get(DBFundsFundraisingProvider);
  let activeMarathon: Marathon | null = null;
  try {
    logger.trace("Finding current marathon for DBFunds sync");
    activeMarathon = await marathonRepository.findActiveMarathon();
    logger.trace("Found current marathon for DBFunds sync", activeMarathon);
  } catch (error) {
    return Result.err(
      toPrismaError(error).unwrapOrElse(() => toBasicError(error))
    );
  }
  if (!activeMarathon) {
    return Result.err(
      new NotFoundError({ what: "Current Marathon", where: "syncDbFunds job" })
    );
  }
  const teams = await fundraisingProvider.getTeams(
    activeMarathon.year as MarathonYearString
  );
  if (teams.isErr) {
    return Result.err(teams.error);
  }
  logger.trace("Got teams for DBFunds sync", { teamCount: teams.value.length });

  const promises = teams.value.map(async (team) => {
    const entries = await fundraisingProvider.getTeamEntries(
      activeMarathon.year as MarathonYearString,
      team.identifier
    );
    if (entries.isErr) {
      return Result.err(entries.error);
    }
    return fundraisingRepository.overwriteTeamForFiscalYear(
      {
        active: team.active,
        dbNum: team.identifier,
        name: team.name,
        total: team.total,
      },
      { id: activeMarathon.id },
      entries.value
    );
  });

  const results = await Promise.allSettled(promises);

  const errors: DoSyncError[] = [];
  for (const result of results) {
    if (result.status === "rejected") {
      errors.push(toBasicError(result.reason));
    } else if (result.value.isErr) {
      if (result.value.error instanceof CompositeError) {
        errors.push(...result.value.error.errors);
      } else {
        errors.push(result.value.error);
      }
    }
  }

  return errors.length > 0
    ? Result.err(new CompositeError(errors))
    : Result.ok();
}

export const syncDbFunds = new Cron(
  "0 */11 * * * *",
  {
    name: "sync-db-funds",
    catch: (error) => {
      console.error("Failed to sync DBFunds", error);
    },
  },
  async () => {
    logger.info("Syncing DBFunds");
    const result = await doSync();
    if (result.isErr) {
      logger.error("Failed to sync DBFunds", result.error);
    } else {
      logger.info("DBFunds sync complete");
    }
  }
);

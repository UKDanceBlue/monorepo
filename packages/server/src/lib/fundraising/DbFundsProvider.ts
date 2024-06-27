import type { MarathonYearString } from "@ukdanceblue/common";
import { DateTime } from "luxon";
import { Maybe, Result } from "true-myth";
import { err } from "true-myth/result";
import { Inject, Service } from "typedi";
import { z } from "zod";

import {
  dbFundsApiKeyToken,
  dbFundsApiOriginToken,
} from "../../environment.js";
import { TimeoutError } from "../error/direct.js";
import { BasicError, toBasicError } from "../error/error.js";
import { HttpError } from "../error/http.js";
import { ConcreteResult } from "../error/result.js";
import { ZodError } from "../error/zod.js";

import type {
  FundraisingEntry,
  FundraisingProvider,
  FundraisingTeam,
} from "./FundraisingProvider.js";

const dbFundsFundraisingTeamSchema = z.object({
  DbNum: z.number().int().nonnegative().describe("The team's dbNum"),
  Team: z.string().describe("The name of the team"),
  Active: z.boolean().describe("Whether the team is active"),
  Total: z
    .number()
    .describe(
      "The amount donated in dollars, with two decimal places for cents"
    )
    .nonnegative()
    .multipleOf(0.01, "Must be a whole number of cents"),
});

// Checks for any variation of "n/a" or "na" (case-insensitive)
const isNA = /^n\/?a$/i;

const dbFundsFundraisingEntrySchema = z.object({
  dbnum: z
    .number()
    .describe("The dbNum of the team to which these entries belong")
    .int()
    .nonnegative(),
  name: z
    .string()
    .describe("The name of the team to which these entries belong"),
  entries: z.array(
    z.object({
      donatedBy: z
        .string()
        .describe("The name of the person who donated")
        .transform((v) => (isNA.test(v) || v.length === 0 ? null : v))
        .nullable(),
      donatedTo: z
        .string()
        .describe("The name of the person or team who received the donation")
        .transform((v) => (isNA.test(v) || v.length === 0 ? null : v))
        .nullable(),
      donatedOn: z
        .string()
        .describe("The date and time the donation was made, in Eastern time")
        // Checks for what passes for an ISO date in the DBFunds API
        .transform((v) =>
          DateTime.fromISO(v, {
            zone: "America/New_York",
          })
        )
        .refine((v) => v.isValid, {
          message: "Must be a valid ISO 8601 date",
        }),
      // NOTE: Currently the API sends the amount as a number of cents (i.e. it sends 100.00 for $1.00) even though the total is
      // in dollars (i.e. it sends 1.00 for $1.00). This is a bit inconsistent, but it's not a big deal. We can just convert the
      // amount to dollars when we use it and this has already taken long enough to get going that I don't want to spend time
      // waiting for DBFunds to fix it.
      amount: z
        .number()
        .describe("The amount donated in cents")
        .nonnegative()
        .int(),
    })
  ),
});

function teamTotalPath(year: number | string): string {
  return `/api/report/teamtotals/${year}`;
}

function teamEntriesPath(
  dbNum: number | string,
  year: number | string
): string {
  return `/api/report/teamentries/${dbNum}/${year}`;
}

export type DBFundsFundraisingProviderError =
  | HttpError
  | ZodError
  | BasicError
  | TimeoutError;

@Service()
export class DBFundsFundraisingProvider implements FundraisingProvider<number> {
  constructor(
    @Inject(dbFundsApiOriginToken)
    private readonly dbFundsApiOrigin: string,
    @Inject(dbFundsApiKeyToken)
    private readonly dbFundsApiKey: string
  ) {}

  private async fetchJson(
    path: string | URL
  ): Promise<ConcreteResult<unknown, DBFundsFundraisingProviderError>> {
    let response: Response;
    let timeout: ReturnType<typeof setTimeout> | undefined = undefined;
    try {
      const url = new URL(path, this.dbFundsApiOrigin);
      const abort = new AbortController();
      timeout = setTimeout(() => {
        abort.abort();
      }, 2500);
      response = await fetch(url, {
        headers: {
          "X-AuthToken": this.dbFundsApiKey,
        },
        signal: abort.signal,
      });
    } catch (error) {
      return err(
        error instanceof Error && error.name === "AbortError"
          ? new TimeoutError("Fetching data from DbFunds")
          : toBasicError(error)
      );
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      return err<never, HttpError>(new HttpError(response.status));
    }

    return Result.ok<unknown, never>(await response.json());
  }

  async getTeams(
    marathonYear: MarathonYearString
  ): Promise<
    ConcreteResult<FundraisingTeam<number>[], DBFundsFundraisingProviderError>
  > {
    const calendarYear = `20${marathonYear.substring(2)}`;
    const path = teamTotalPath(calendarYear);
    const result = await this.fetchJson(path);
    if (result.isErr) {
      return result.cast<never>();
    }

    const teams = dbFundsFundraisingTeamSchema.array().safeParse(result.value);
    if (teams.success) {
      return Result.ok(
        teams.data.map((team) => ({
          name: team.Team,
          active: team.Active,
          identifier: team.DbNum,
          total: team.Total,
        }))
      );
    } else {
      return Result.err(new ZodError(teams.error));
    }
  }
  async getTeamEntries(
    marathonYear: MarathonYearString,
    dbNum: number
  ): Promise<
    ConcreteResult<FundraisingEntry[], DBFundsFundraisingProviderError>
  > {
    const calendarYear = `20${marathonYear.substring(2)}`;
    const path = teamEntriesPath(dbNum, calendarYear);

    const result = await this.fetchJson(path);
    if (result.isErr) {
      return result.cast<never>();
    }

    const entries = dbFundsFundraisingEntrySchema.safeParse(result.value);
    if (entries.success) {
      return Result.ok(
        entries.data.entries.map((entry) => ({
          donatedBy: Maybe.of(entry.donatedBy),
          donatedTo: Maybe.of(entry.donatedTo),
          // donatedOn is in Eastern time
          donatedOn: entry.donatedOn,
          // Convert the amount from cents to dollars
          amount: entry.amount / 100,
        }))
      );
    } else {
      return Result.err(new ZodError(entries.error));
    }
  }
}

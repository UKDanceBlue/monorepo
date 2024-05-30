import type { MarathonYearString } from "@ukdanceblue/common";
import { DateTime } from "luxon";
import { Maybe, Result } from "true-myth";
import { Inject, Service } from "typedi";
import { z } from "zod";

import {
  dbFundsApiKeyToken,
  dbFundsApiOriginToken,
} from "../../environment.js";
import { JsError, UnknownError, asBasicError } from "../error/error.js";
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

const dbFundsFundraisingEntrySchema = z.object({
  dbNum: z
    .number()
    .describe("The dbNum of the team to which these entries belong")
    .int()
    .nonnegative(),
  name: z
    .string()
    .describe("The name of the team to which these entries belong"),
  entries: z.array(
    z.object({
      donatedBy: z.string().describe("The name of the person who donated"),
      donatedTo: z
        .string()
        .describe("The name of the person or team who received the donation")
        .transform((v) => (v === "N/A" ? null : v))
        .nullable(),
      donatedOn: z
        .string()
        .describe("The date and time the donation was made, in Eastern time")
        .datetime(),
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
  ): Promise<ConcreteResult<unknown, HttpError | JsError | UnknownError>> {
    let response: Response;
    try {
      const url = new URL(path, this.dbFundsApiOrigin);
      response = await fetch(url, {
        headers: {
          "X-AuthToken": this.dbFundsApiKey,
        },
      });
    } catch (error) {
      return Result.err(asBasicError(error));
    }

    if (!response.ok) {
      return Result.err<never, HttpError>(new HttpError(response.status));
    }

    return Result.ok<unknown, never>(await response.json());
  }

  async getTeams(
    marathonYear: MarathonYearString
  ): Promise<
    ConcreteResult<
      FundraisingTeam<number>[],
      HttpError | JsError | UnknownError | ZodError
    >
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
    ConcreteResult<
      FundraisingEntry[],
      HttpError | JsError | UnknownError | ZodError
    >
  > {
    const calendarYear = `20${marathonYear.substring(2)}`;
    const path = teamEntriesPath(dbNum, calendarYear);

    const result = await this.fetchJson(path);
    if (result.isErr) {
      return result.cast<never>();
    }

    const entries = dbFundsFundraisingEntrySchema
      .array()
      .safeParse(result.value);
    if (entries.success) {
      return Result.ok(
        entries.data.flatMap((team) =>
          team.entries.map((entry) => ({
            donatedBy: entry.donatedBy,
            donatedTo: Maybe.of(entry.donatedTo),
            // donatedOn is in Eastern time
            donatedOn: DateTime.fromISO(entry.donatedOn, {
              zone: "America/New_York",
            }),
            amount: entry.amount,
          }))
        )
      );
    } else {
      return Result.err(new ZodError(entries.error));
    }
  }
}

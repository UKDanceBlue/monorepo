import type { MarathonYearString } from "@ukdanceblue/common";
import type { DateTime } from "luxon";

import type { JsError, UnknownError } from "../error/error.js";
import type { HttpError } from "../error/http.js";
import type { ConcreteResult } from "../error/result.js";

export interface FundraisingTeam {
  name: string;
  total: number;
}

export interface FundraisingEntry {
  donatedBy: string;
  donatedTo?: string | null | undefined;
  donatedOn: DateTime;
  amount: number;
}

export interface FundraisingProvider {
  getTeams(
    marathonYear: MarathonYearString
  ): Promise<
    ConcreteResult<FundraisingTeam[], HttpError | JsError | UnknownError>
  >;
  getTeamEntries(
    marathonYear: MarathonYearString,
    identifier: unknown
  ): Promise<
    ConcreteResult<FundraisingEntry[], HttpError | JsError | UnknownError>
  >;
}

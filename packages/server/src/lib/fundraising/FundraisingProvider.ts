import type { MarathonYearString } from "@ukdanceblue/common";
import type { DateTime } from "luxon";
import type { Maybe } from "true-myth";

import type { JsError, UnknownError } from "../error/error.js";
import type { HttpError } from "../error/http.js";
import type { ConcreteResult } from "../error/result.js";

export interface FundraisingTeam<IDType> {
  name: string;
  active: boolean;
  identifier: IDType;
  total: number;
}

export interface FundraisingEntry {
  donatedBy: string;
  donatedTo: Maybe<string>;
  donatedOn: DateTime;
  amount: number;
}

export interface FundraisingProvider<IDType> {
  getTeams(
    marathonYear: MarathonYearString
  ): Promise<
    ConcreteResult<
      FundraisingTeam<IDType>[],
      HttpError | JsError | UnknownError
    >
  >;
  getTeamEntries(
    marathonYear: MarathonYearString,
    identifier: unknown
  ): Promise<
    ConcreteResult<FundraisingEntry[], HttpError | JsError | UnknownError>
  >;
}

import type { MarathonYearString } from "@ukdanceblue/common";
import type { ConcreteResult } from "@ukdanceblue/common/error";
import type { DateTime } from "luxon";
import type { Option } from "ts-results-es";

export interface FundraisingTeam<IDType> {
  name: string;
  active: boolean;
  identifier: IDType;
  total: number;
}

export interface FundraisingEntry {
  donatedBy: Option<string>;
  donatedTo: Option<string>;
  donatedOn: DateTime;
  amount: number;
}

export interface FundraisingProvider<IDType> {
  getTeams(
    marathonYear: MarathonYearString
  ): Promise<ConcreteResult<FundraisingTeam<IDType>[]>>;
  getTeamEntries(
    marathonYear: MarathonYearString,
    identifier: IDType
  ): Promise<ConcreteResult<FundraisingEntry[]>>;
}

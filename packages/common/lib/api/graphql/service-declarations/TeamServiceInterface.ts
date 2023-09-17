import { Token } from "typedi";

import type { TeamResource } from "../object-types/Team.js";

import type { ServiceInterface } from "./ServiceInterface.js";

export type TeamServiceInterface = ServiceInterface<TeamResource>

export const teamServiceToken = new Token<TeamServiceInterface>("TeamService");

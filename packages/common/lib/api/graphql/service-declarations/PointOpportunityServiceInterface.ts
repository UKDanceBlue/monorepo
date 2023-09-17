import { Token } from "typedi";

import type { PointOpportunityResource } from "../object-types/PointOpportunity.js";

import type { ServiceInterface } from "./ServiceInterface.js";

export type PointOpportunityServiceInterface = ServiceInterface<PointOpportunityResource>

export const pointOpportunityServiceToken = new Token<PointOpportunityServiceInterface>("PointOpportunityService");

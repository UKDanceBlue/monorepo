import { Token } from "typedi";

import type { PointEntryResource } from "../object-types/PointEntry.js";

import type { ServiceInterface } from "./ServiceInterface.js";

export type PointEntryServiceInterface = ServiceInterface<PointEntryResource>

export const pointEntryServiceToken = new Token<PointEntryServiceInterface>("PointEntryService");

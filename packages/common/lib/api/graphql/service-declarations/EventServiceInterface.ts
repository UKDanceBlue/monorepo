import { Token } from "typedi";

import type { EventResource } from "../object-types/Event.js";

import type { ServiceInterface } from "./ServiceInterface.js";

export type EventServiceInterface = ServiceInterface<EventResource>

export const eventServiceToken = new Token<EventServiceInterface>("EventService");

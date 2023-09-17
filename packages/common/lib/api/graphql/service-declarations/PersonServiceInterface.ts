import { Token } from "typedi";

import type { PersonResource } from "../object-types/Person.js";

import type { ServiceInterface } from "./ServiceInterface.js";

export type PersonServiceInterface = ServiceInterface<PersonResource>

export const personServiceToken = new Token<PersonServiceInterface>("PersonService");

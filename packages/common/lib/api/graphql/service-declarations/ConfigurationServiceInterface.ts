import { Token } from "typedi";

import type { ConfigurationResource } from "../object-types/Configuration.js";

import type { ServiceInterface } from "./ServiceInterface.js";

export interface ConfigurationServiceInterface extends ServiceInterface<ConfigurationResource> {
  getAll(): Promise<ConfigurationResource[]>;
}

export const configurationServiceToken = new Token<ConfigurationServiceInterface>("ConfigurationService");

import { Token } from "typedi";

import type { ImageResource } from "../object-types/Image.js";

import type { ServiceInterface } from "./ServiceInterface.js";

export interface ImageServiceInterface extends ServiceInterface<ImageResource> {
  getThumbHashByUUid(uuid: string): Promise<string | null>;
}

export const imageServiceToken = new Token<ImageServiceInterface>("ImageService");

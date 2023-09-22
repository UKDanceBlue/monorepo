import type { Model } from "@sequelize/core";
import type { Resource } from "@ukdanceblue/common";

import type { IntermediateClass } from "../modelTypes.js";

export type ResourceToModelKeyMapping<
  R extends Resource,
  M extends Model,
  I extends IntermediateClass<R, I>
> = Partial<Record<keyof R, Extract<keyof M, string>>>;

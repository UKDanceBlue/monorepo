import type { Model } from "@sequelize/core";
import type { GraphQLResource } from "@ukdanceblue/db-app-common";

import type { IntermediateClass } from "../modelTypes.js";

export type ResourceToModelKeyMapping<
  R extends GraphQLResource.Resource,
  M extends Model,
  I extends IntermediateClass<R, I>
> = Partial<Record<keyof R, Extract<keyof M, string>>>;

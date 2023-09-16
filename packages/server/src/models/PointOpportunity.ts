import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "@sequelize/core";
import { DataTypes, Model } from "@sequelize/core";
import type { } from "@ukdanceblue/common";
import { CommitteeRole, DbRole } from "@ukdanceblue/common";

import type { IntermediateClass } from "../lib/modelTypes.js";

// @Table({
//   tableName: "",
// })
// export class ModelName
//   extends Model<InferAttributes<ModelName>, InferCreationAttributes<ModelName>>
//   implements WithToJsonFor<ResourceName> {}

import type { CreationOptional } from "@sequelize/core";
import { Model } from "@sequelize/core";

export class WithTimestamps<
  // eslint-disable-next-line @typescript-eslint/ban-types
  TModelAttributes extends {} = never,
  // eslint-disable-next-line @typescript-eslint/ban-types
  TCreationAttributes extends {} = TModelAttributes,
> extends Model<TModelAttributes, TCreationAttributes> {
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
  declare readonly deletedAt: CreationOptional<Date | null>;
}

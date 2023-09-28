import type {
  Attributes,
  CreationOptional,
  FindOptions,
  InferAttributes,
  InferCreationAttributes,
  ModelStatic,
  NonNullFindOptions,
} from "@sequelize/core";
import { Model, Op } from "@sequelize/core";

export abstract class BaseModel<
  TModelAttributes extends { uuid: string },
  TCreationAttributes extends object = TModelAttributes,
> extends Model<TModelAttributes, TCreationAttributes> {
  declare uuid: CreationOptional<string>;

  /**
   * Search for a single instance by its UUID.
   *
   * Returns the first instance corresponding matching the query.
   * If not found, returns null or throws an error if {@link FindOptions.rejectOnEmpty} is set.
   */
  static async findByUuid<
    M extends BaseModel<
      InferAttributes<M> & { uuid: string },
      InferCreationAttributes<M>
    >,
    NonNull extends boolean,
  >(
    this: ModelStatic<M>,
    uuid: string,
    options?: (NonNull extends true
      ? NonNullFindOptions<Attributes<M>>
      : FindOptions<Attributes<M>>) & {
      where: never;
    }
  ): Promise<NonNull extends true ? M : M | null> {
    const result: M | null = await this.findOne({
      ...options,
      where: {
        uuid: {
          // Dunno why this is being weird, just make it work
          [Op.eq]: uuid as never,
        },
      },
    });

    return result as NonNull extends true
      ? Exclude<typeof result, null>
      : typeof result;
  }
}
